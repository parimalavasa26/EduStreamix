const mongoose = require('mongoose');
require('dotenv').config();

async function debugIcse9() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const docs = await mongoose.connection.db.collection('icse9').find({}).toArray();
    docs.forEach(d => {
      console.log(`Subject: "${d.subject}", Grade: ${d.grade}, ID: ${d._id}`);
      if (d.subject === 'History & Civics') {
         console.log('Units:', JSON.stringify(d.units, null, 2));
      }
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
debugIcse9();
