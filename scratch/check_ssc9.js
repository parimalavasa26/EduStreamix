const mongoose = require('mongoose');

async function check() {
  try {
    await mongoose.connect('mongodb://localhost:27017/syllabus');
    const db = mongoose.connection.db;
    const doc = await db.collection('ssc9').findOne({ grade: 9, subject: 'Mathematics' });
    console.log('Document in ssc9 collection:');
    console.log(JSON.stringify(doc, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
