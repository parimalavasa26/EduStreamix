const mongoose = require('mongoose');
const Subject = require('../models/Subject');
require('dotenv').config({ path: '../.env' });

async function updatePDF() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix');
    console.log('Connected to MongoDB');

    const grade = 8;
    const board = 'CBSE';
    // Case-insensitive subject match to be safe
    const subjectRegex = new RegExp('^social science$', 'i');
    
    let doc = await Subject.findOne({ grade, board, subject: subjectRegex });

    if (!doc) {
      console.log('Document not found for Social Science, creating it...');
      // Create it if it doesn't exist
      doc = new Subject({
        grade,
        board,
        subject: 'Social Science',
        units: [{
          unitName: 'General',
          chapters: []
        }]
      });
    }

    const chapterName = 'How, When and Where';
    const pdfUrl = 'https://1drv.ms/b/c/a9d97bb3598383ad/IQCi299SRw3cSrFg_xsaAiXzATjaYlr50mrgDLqzPEk-uYU?e=L6m1LL';

    let foundChapter = false;
    for (const unit of doc.units) {
      for (const ch of unit.chapters) {
        if (ch.chapterName.toLowerCase() === chapterName.toLowerCase()) {
          ch.pdfUrl = pdfUrl;
          ch.pdfTitle = chapterName;
          foundChapter = true;
          break;
        }
      }
      if (foundChapter) break;
    }

    if (!foundChapter) {
      console.log('Chapter not found, adding it...');
      doc.units[0].chapters.push({
        chapterName: chapterName,
        pdfUrl: pdfUrl,
        pdfTitle: chapterName
      });
    }

    await doc.save();
    console.log('Successfully updated PDF URL for chapter:', chapterName);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updatePDF();
