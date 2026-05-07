require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const doc = await Subject.findOne({ grade: 8, board: 'CBSE', subject: 'Social Science' });
  console.log(JSON.stringify(doc, null, 2));
  process.exit(0);
}
check();
