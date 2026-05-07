const mongoose = require('mongoose');
require('dotenv').config();
const Subject = require('../models/Subject');

async function checkGrade8() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edustreamix');
    console.log('Connected to MongoDB');

    const cbse8 = await Subject.find({ grade: 8, board: 'CBSE' });
    console.log(`\nFound ${cbse8.length} subjects for Grade 8 CBSE`);
    cbse8.forEach(s => {
      console.log(` - ${s.subject}: ${s.units[0]?.chapters.length || 0} chapters found in DB`);
    });

    const ssc8 = await Subject.find({ grade: 8, board: 'SSC' });
    console.log(`\nFound ${ssc8.length} subjects for Grade 8 SSC`);
    ssc8.forEach(s => {
      console.log(` - ${s.subject}: ${s.units[0]?.chapters.length || 0} chapters found in DB`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkGrade8();
