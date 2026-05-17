const mongoose = require('mongoose');
require('dotenv').config();

async function checkSsc9Social() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const doc = await mongoose.connection.db.collection('ssc9').findOne({ subject: 'Social' });
    if (doc) {
      console.log('SSC 9 Social chapters:', doc.units.map(u => u.name || u.unit));
    } else {
      console.log('Social not found in ssc9');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkSsc9Social();
