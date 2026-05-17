const mongoose = require('mongoose');
require('dotenv').config();

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Subject = mongoose.model('Subject', new mongoose.Schema({}, { strict: false }));
    const docs = await Subject.find({ grade: 9, board: 'ICSE' });
    console.log('Found ICSE 9 docs:', docs.length);
    if (docs.length > 0) {
      console.log(JSON.stringify(docs, null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
inspect();
