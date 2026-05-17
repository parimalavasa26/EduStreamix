const mongoose = require('mongoose');
require('dotenv').config();

async function fixCbse9() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Rename Social Studies -> Social Science for CBSE 9
    const res = await mongoose.connection.db.collection('cbse9').updateOne(
      { subject: 'Social Studies' },
      { $set: { subject: 'Social Science' } }
    );
    console.log('Renamed Social Studies to Social Science for CBSE 9:', res.modifiedCount);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fixCbse9();
