require('dotenv').config();

const dns = require('dns');
const mongoose = require('mongoose');

const dnsPromises = dns.promises;

function getEnv(name) {
  return process.env[name] || '';
}

function getDnsOverride() {
  if (process.env.USE_PUBLIC_DNS === '1') {
    return ['8.8.8.8', '1.1.1.1'];
  }

  return getEnv('MONGODB_DNS_SERVERS')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);
}

function redactMongoUri(uri) {
  if (!uri) {
    return '<missing>';
  }

  try {
    const parsed = new URL(uri);
    if (parsed.username) parsed.username = '***';
    if (parsed.password) parsed.password = '***';
    return parsed.toString();
  } catch (err) {
    return '<invalid MongoDB URI>';
  }
}

function parseMongoUri(uri) {
  try {
    const parsed = new URL(uri);
    return {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      pathname: parsed.pathname || '/',
      database: (parsed.pathname || '').replace(/^\//, '') || '<default>',
      isSrv: parsed.protocol === 'mongodb+srv:',
      hasUsername: Boolean(parsed.username),
      hasPassword: Boolean(parsed.password),
      searchParams: parsed.searchParams
    };
  } catch (err) {
    console.error('MONGO_URI parse failed.');
    logError(err);
    return null;
  }
}

function logError(err) {
  console.error({
    code: err?.code,
    errno: err?.errno,
    syscall: err?.syscall,
    hostname: err?.hostname,
    message: err?.message
  });

  if (err?.stack) {
    console.error(err.stack);
  }
}

function callbackTest(label, run) {
  return new Promise((resolve) => {
    run((err, result) => {
      if (err) {
        console.error(`${label} failed`);
        logError(err);
      } else {
        console.log(`${label} succeeded`, result);
      }

      resolve();
    });
  });
}

function parseTxtOptions(txtRecords) {
  const params = new URLSearchParams();

  for (const record of txtRecords) {
    const text = record.join('');
    const recordParams = new URLSearchParams(text);

    for (const [key, value] of recordParams.entries()) {
      params.set(key, value);
    }
  }

  return params;
}

async function buildStandardUriFromSrv(uri) {
  const parsed = parseMongoUri(uri);

  if (!parsed || !parsed.isSrv) {
    return null;
  }

  const srvName = `_mongodb._tcp.${parsed.hostname}`;
  const srvRecords = await dnsPromises.resolveSrv(srvName);
  const hosts = srvRecords
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((record) => `${record.name}:${record.port}`)
    .join(',');

  const params = new URLSearchParams(parsed.searchParams);

  try {
    const txtRecords = await dnsPromises.resolveTxt(parsed.hostname);
    const txtParams = parseTxtOptions(txtRecords);

    for (const [key, value] of txtParams.entries()) {
      if (!params.has(key)) {
        params.set(key, value);
      }
    }
  } catch (err) {
    console.warn('TXT lookup failed while building converted standard URI.');
    logError(err);
  }

  if (!params.has('tls') && !params.has('ssl')) {
    params.set('tls', 'true');
  }

  const source = new URL(uri);
  const auth = source.username
    ? `${encodeURIComponent(decodeURIComponent(source.username))}:${encodeURIComponent(decodeURIComponent(source.password))}@`
    : '';
  const query = params.toString();

  return `mongodb://${auth}${hosts}${parsed.pathname}${query ? `?${query}` : ''}`;
}

async function testMongoConnection(label, uri) {
  if (!uri) {
    console.log(`${label} not configured`);
    return;
  }

  console.log(`Testing MongoDB connection with ${label}: ${redactMongoUri(uri)}`);

  try {
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    }).asPromise();

    console.log(`${label} connection succeeded`, {
      database: conn.name,
      readyState: conn.readyState
    });

    await conn.close();
  } catch (err) {
    console.error(`${label} connection failed`);
    logError(err);
  }
}

async function main() {
  const overrideServers = getDnsOverride();

  dns.setDefaultResultOrder('ipv4first');

  if (overrideServers.length > 0) {
    dns.setServers(overrideServers);
  }

  console.log('Node runtime:', {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uv: process.versions.uv,
    cares: process.versions.ares,
    nodeOptions: process.env.NODE_OPTIONS || '<not set>',
    dnsServers: dns.getServers(),
    publicDnsTestMode: process.env.USE_PUBLIC_DNS === '1'
  });

  const mongoUri = getEnv('MONGO_URI');
  const directUri = getEnv('MONGO_URI_DIRECT') || getEnv('ATLAS_MONGO_URI_DIRECT');
  const parsed = parseMongoUri(mongoUri);

  if (!parsed) {
    process.exitCode = 1;
    return;
  }

  console.log('Mongo URI diagnostics:', {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    database: parsed.database,
    hasUsername: parsed.hasUsername,
    hasPassword: parsed.hasPassword
  });

  const srvName = `_mongodb._tcp.${parsed.hostname}`;

  await callbackTest(`dns.lookup(${parsed.hostname})`, (done) => {
    dns.lookup(parsed.hostname, { all: true }, done);
  });

  await callbackTest(`dns.resolveSrv(${srvName})`, (done) => {
    dns.resolveSrv(srvName, done);
  });

  await callbackTest(`dns.resolveTxt(${parsed.hostname})`, (done) => {
    dns.resolveTxt(parsed.hostname, done);
  });

  try {
    const result = await dnsPromises.resolveSrv(srvName);
    console.log(`dns.promises.resolveSrv(${srvName}) succeeded`, result);
  } catch (err) {
    console.error(`dns.promises.resolveSrv(${srvName}) failed`);
    logError(err);
  }

  if (parsed.isSrv) {
    try {
      const convertedUri = await buildStandardUriFromSrv(mongoUri);
      console.log('Converted standard URI from SRV records:', redactMongoUri(convertedUri));
    } catch (err) {
      console.error('Could not convert SRV URI to standard URI from Node DNS results.');
      logError(err);
      console.log('Use MONGO_URI_DIRECT with the Atlas Standard connection string to bypass Node SRV/TXT resolution.');
    }
  }

  await testMongoConnection('MONGO_URI', mongoUri);
  await testMongoConnection('MONGO_URI_DIRECT', directUri);
}

main().catch((err) => {
  console.error('Standalone MongoDB DNS test crashed');
  logError(err);
  process.exitCode = 1;
});
