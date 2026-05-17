const mongoose = require('mongoose');
require('dotenv').config();

async function fixSsc9() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Rename Social -> Social Studies
    const res1 = await mongoose.connection.db.collection('ssc9').updateOne(
      { subject: 'Social' },
      { $set: { subject: 'Social Studies' } }
    );
    console.log('Renamed Social to Social Studies:', res1.modifiedCount);

    // Rename Biological Science -> Biology
    const res2 = await mongoose.connection.db.collection('ssc9').updateOne(
      { subject: 'Biological Science' },
      { $set: { subject: 'Biology' } }
    );
    console.log('Renamed Biological Science to Biology:', res2.modifiedCount);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fixSsc9();
