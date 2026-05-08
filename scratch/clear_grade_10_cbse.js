const mongoose = require('mongoose');
require('dotenv').config();
const Subject = require('../models/Subject');

async function clearGrade10CBSE() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edustreamix');
    console.log('Connected to MongoDB');

    const result = await Subject.deleteMany({ grade: 10, board: 'CBSE' });
    console.log(`Successfully deleted ${result.deletedCount} subjects for Grade 10 CBSE.`);
    console.log('Now the platform will use the default chapters you added in studyController.js.');

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

clearGrade10CBSE();
