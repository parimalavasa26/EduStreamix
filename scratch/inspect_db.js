const mongoose = require('mongoose');

async function inspect() {
  try {
    const uri2 = 'mongodb://localhost:27017/EduStreamX'; 
    const conn2 = await mongoose.createConnection(uri2).asPromise();
    console.log(`\nConnected to ${uri2}`);
    const collections2 = await conn2.db.listCollections().toArray();
    console.log("Collections:", collections2.map(c => c.name));

    for (let c of collections2) {
      console.log(`\n--- Schema for ${c.name} ---`);
      const doc = await conn2.db.collection(c.name).findOne();
      console.log(JSON.stringify(doc, null, 2));
    }

    const uri = 'mongodb://localhost:27017/EduSreamX';
    const conn = await mongoose.createConnection(uri).asPromise();
    console.log(`\nConnected to ${uri}`);
    const collections = await conn.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    for (let c of collections) {
      console.log(`\n--- Schema for ${c.name} ---`);
      const doc = await conn.db.collection(c.name).findOne();
      console.log(JSON.stringify(doc, null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

inspect();
