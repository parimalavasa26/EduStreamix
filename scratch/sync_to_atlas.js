require('dotenv').config();
const mongoose = require('mongoose');

const LOCAL_URI  = 'mongodb://127.0.0.1:27017/edustreamix';
// Use direct MongoDB URI bypassing SRV resolution because Node's DNS resolver fails on this network
const ATLAS_URI  = 'mongodb://admin:parimala%40888@ac-5gzeje0-shard-00-00.ixuccs7.mongodb.net:27017,ac-5gzeje0-shard-00-01.ixuccs7.mongodb.net:27017,ac-5gzeje0-shard-00-02.ixuccs7.mongodb.net:27017/edustreamix?ssl=true&replicaSet=atlas-jh2gr4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Project1';

const COLLECTIONS = [
  'subjects',
  'videos',
  'SSC_Syllabi',
  'CBSE_Syllabi',
  'ISC_Syllabi',
  'configs'
];

async function syncCollection(localDb, atlasDb, name) {
  const localCol = localDb.collection(name);
  const atlasCol = atlasDb.collection(name);

  const docs = await localCol.find({}).toArray();

  if (docs.length === 0) {
    console.log(`  ⚠️  ${name}: empty locally — skipping`);
    return 0;
  }

  await atlasCol.deleteMany({});
  const result = await atlasCol.insertMany(docs, { ordered: false });
  return result.insertedCount;
}

async function main() {
  console.log('\n🔄  EduStreamix — Local → Atlas Sync (Direct Bypass Mode)\n');

  console.log('⏳  Connecting to local MongoDB…');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  const localDb   = localConn.db;
  console.log('✅  Local connected.\n');

  console.log('⏳  Connecting to MongoDB Atlas (bypassing SRV DNS)…');
  const atlasConn = await mongoose.createConnection(ATLAS_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
  }).asPromise();
  const atlasDb   = atlasConn.db;
  console.log('✅  Atlas connected.\n');

  console.log('📦  Syncing collections:\n');
  const summary = [];

  for (const col of COLLECTIONS) {
    process.stdout.write(`  Syncing ${col.padEnd(18)} … `);
    try {
      const count = await syncCollection(localDb, atlasDb, col);
      console.log(`${count} docs ✅`);
      summary.push({ collection: col, docs: count });
    } catch (err) {
      console.log(`FAILED ❌  (${err.message})`);
    }
  }

  console.log('\n✅  Sync complete!\n');
  await localConn.close();
  await atlasConn.close();
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err.message);
  process.exit(1);
});
