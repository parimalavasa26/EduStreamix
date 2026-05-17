const mongoose = require('mongoose');
require('dotenv').config();

async function renameHistory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Rename History & Civics -> History and Civics in icse9
    const res = await mongoose.connection.db.collection('icse9').updateOne(
      { subject: 'History & Civics' },
      { $set: { subject: 'History and Civics' } }
    );
    console.log('Renamed in icse9:', res.modifiedCount);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
renameHistory();
