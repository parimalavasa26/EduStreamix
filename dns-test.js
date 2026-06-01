require('dotenv').config();
const dns = require('dns');
const dnsPromises = dns.promises;

function getEnv(name) {
  return process.env[name] || '';
}

function redactUri(uri) {
  if (!uri) return '<missing>';
  try {
    const parsed = new URL(uri);
    if (parsed.username) parsed.username = '***';
    if (parsed.password) parsed.password = '***';
    return parsed.toString();
  } catch (err) {
    return '<invalid-uri>';
  }
}

async function run() {
  console.log('Starting dns-test.js');
  console.log('Node dns.getServers():', dns.getServers());

  const uri = getEnv('MONGO_URI');
  if (!uri) {
    console.error('MONGO_URI is not set in environment');
    process.exit(1);
  }

  console.log('MONGO_URI:', redactUri(uri));

  try {
    const parsed = new URL(uri);
    const hostname = parsed.hostname;
    const srvName = `_mongodb._tcp.${hostname}`;

    console.log(`\nRunning dns.lookup(${hostname})`);
    const lookupResult = await dnsPromises.lookup(hostname, { all: true });
    console.log('dns.lookup result:', lookupResult);

    console.log(`\nRunning dns.resolveSrv(${srvName})`);
    const srvResult = await dnsPromises.resolveSrv(srvName);
    console.log('dns.resolveSrv result:', srvResult);

    console.log(`\nRunning dns.resolveTxt(${hostname})`);
    const txtResult = await dnsPromises.resolveTxt(hostname);
    console.log('dns.resolveTxt result:', txtResult);

    console.log('\nDNS tests completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('dns-test.js failed:', err?.code || err?.message || err);
    if (err?.stack) console.error(err.stack);
    process.exit(2);
  }
}

run();
