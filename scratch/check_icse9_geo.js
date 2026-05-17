const mongoose = require('mongoose');
require('dotenv').config();

async function checkIcse9Geo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const doc = await mongoose.connection.db.collection('icse9').findOne({ subject: 'Geography' });
    console.log(JSON.stringify(doc, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkIcse9Geo();
