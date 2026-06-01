require('dotenv').config();
const dns = require('dns').promises;

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not set in environment');
    process.exit(2);
  }

  try {
    const parsed = new URL(mongoUri);
    const srvName = `_mongodb._tcp.${parsed.hostname}`;
    console.log('Resolving SRV for', srvName);
    const srv = await dns.resolveSrv(srvName);
    console.log('SRV records:', srv);

    console.log('Resolving TXT for', parsed.hostname);
    const txt = await dns.resolveTxt(parsed.hostname);
    console.log('TXT records:', txt);

    process.exit(0);
  } catch (err) {
    console.error('DNS resolution failed:', err);
    process.exit(1);
  }
}

main();
