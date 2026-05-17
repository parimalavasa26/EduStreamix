const mongoose = require('mongoose');
require('dotenv').config();

async function checkAllIcse9() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const docs = await mongoose.connection.db.collection('icse9').find({}).toArray();
    docs.forEach(doc => {
      console.log(`--- ${doc.subject} ---`);
      if (doc.units) {
        console.log(doc.units.map(u => u.name || u.unitName).join(', '));
      }
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkAllIcse9();
