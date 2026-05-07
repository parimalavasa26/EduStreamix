const mongoose = require('mongoose');
require('dotenv').config();
const Subject = require('../models/Subject');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edustreamix');
    console.log('Connected to MongoDB');

    const subjects = await Subject.find({ grade: 10, board: 'CBSE' });
    console.log(`Found ${subjects.length} subjects for Grade 10 CBSE`);

    subjects.forEach(s => {
      console.log(`\nSubject: ${s.subject}`);
      s.units.forEach(u => {
        u.chapters.forEach(c => {
          console.log(` - ${c.chapterName}`);
        });
      });
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkDB();
