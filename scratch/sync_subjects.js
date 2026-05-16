require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/edustreamix';
const ATLAS_URI = process.env.ATLAS_MONGO_URI || 'mongodb+srv://admin:parimala%40888@project1.ixuccs7.mongodb.net/edustreamix?retryWrites=true&w=majority&appName=Project1';

const EXPORT_FILE = path.join(__dirname, 'subjects_export.json');

async function main() {
  console.log('--- Step 1: Exporting from Local MongoDB ---');
  let localDocs = [];
  try {
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    const localDb = localConn.db;
    localDocs = await localDb.collection('subjects').find({}).toArray();
    console.log(`✅ Found ${localDocs.length} documents in local 'subjects' collection.`);
    
    // Export to JSON file
    fs.writeFileSync(EXPORT_FILE, JSON.stringify(localDocs, null, 2));
    console.log(`✅ Exported to ${EXPORT_FILE}`);
    
    await localConn.close();
  } catch (err) {
    console.error('❌ Error reading local DB:', err.message);
    process.exit(1);
  }

  if (localDocs.length === 0) {
    console.log('No documents to import. Exiting.');
    return;
  }

  console.log('\n--- Step 2: Importing to MongoDB Atlas ---');
  try {
    const atlasConn = await mongoose.createConnection(ATLAS_URI, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000
    }).asPromise();
    const atlasDb = atlasConn.db;
    const atlasCol = atlasDb.collection('subjects');

    // Clear existing data to avoid duplicates
    console.log('⏳ Clearing existing data in Atlas subjects collection...');
    await atlasCol.deleteMany({});
    
    // Import the exported data
    console.log(`⏳ Importing ${localDocs.length} documents...`);
    const result = await atlasCol.insertMany(localDocs);
    console.log(`✅ Successfully imported ${result.insertedCount} documents into Atlas!`);
    
    await atlasConn.close();
  } catch (err) {
    console.error('❌ Error connecting to or writing to Atlas:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
        console.error('\n⚠️ NETWORK ERROR: Atlas connection refused. This usually means your current IP address is not whitelisted in the MongoDB Atlas Network Access settings.');
    }
  }
}

main();
