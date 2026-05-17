const mongoose = require('mongoose');
require('dotenv').config();

async function checkMathChapters() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const doc = await mongoose.connection.db.collection('icse9').findOne({ subject: 'Mathematics' });
    if (doc) {
      console.log('Mathematics chapters:', doc.units.map(u => u.name));
    } else {
      console.log('Mathematics not found in icse9');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkMathChapters();
