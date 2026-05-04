const mongoose = require('mongoose');
const Subject = require('../models/Subject');
require('dotenv').config({ path: '../.env' });

async function updatePDF() {
  try {
    // Connect to the correct database from .env
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/edustreamx';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB:', uri);

    const grade = 8;
    const board = 'CBSE';
    const subjectRegex = new RegExp('^social science$', 'i');
    const chapterNameRegex = new RegExp('^how,\\s*when\\s*and\\s*where$', 'i');
    
    let doc = await Subject.findOne({ grade, board, subject: subjectRegex });

    if (!doc) {
      console.log('Document not found for Social Science!');
      process.exit(1);
    }

    const pdfUrl = '/uploads/pdfs/grade8_CBSE_SocialScience_ch1.pdf';

    let foundChapter = false;
    for (const unit of doc.units) {
      for (const ch of unit.chapters) {
        if (chapterNameRegex.test(ch.chapterName)) {
          ch.pdfUrl = pdfUrl;
          ch.pdfTitle = ch.chapterName;
          foundChapter = true;
          console.log(`Updated PDF URL in unit: ${unit.unitName}`);
          break;
        }
      }
      if (foundChapter) break;
    }

    if (!foundChapter) {
      console.log('Chapter "How, When and Where" not found in existing units.');
      process.exit(1);
    }

    await doc.save();
    console.log('Successfully updated the correct DB with PDF URL.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updatePDF();
