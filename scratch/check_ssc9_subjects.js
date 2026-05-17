const mongoose = require('mongoose');
require('dotenv').config();

async function checkSsc9() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const docs = await mongoose.connection.db.collection('ssc9').find({}).toArray();
    console.log('Subjects in ssc9:', docs.map(d => d.subject));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkSsc9();
