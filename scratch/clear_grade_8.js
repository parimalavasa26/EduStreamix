const mongoose = require('mongoose');
require('dotenv').config();
const Subject = require('../models/Subject');

async function clearGrade8() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edustreamix');
    console.log('Connected to MongoDB');

    const result = await Subject.deleteMany({ grade: 8 });
    console.log(`Successfully deleted ${result.deletedCount} subjects for Grade 8.`);
    console.log('Grade 8 CBSE and SSC will now use the new defaults from your code.');

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

clearGrade8();
