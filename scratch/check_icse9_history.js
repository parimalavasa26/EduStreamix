const mongoose = require('mongoose');
require('dotenv').config();

async function checkIcse9History() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const doc = await mongoose.connection.db.collection('icse9').findOne({ subject: 'History & Civics' });
    if (doc) {
      console.log('History & Civics chapters in DB:', doc.units.map(u => u.name));
    } else {
      console.log('History & Civics not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkIcse9History();
