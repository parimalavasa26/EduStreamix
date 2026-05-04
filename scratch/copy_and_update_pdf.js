const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
require('dotenv').config({ path: '../.env' });

async function updatePDF() {
  try {
    // 1. Copy the file
    const srcPath = 'C:\\Users\\Parimala\\OneDrive\\Desktop\\social studies cbse\\ch1.pdf';
    const destDir = path.join(__dirname, '../public/uploads/pdfs');
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const fileName = 'grade8_CBSE_SocialScience_ch1.pdf';
    const destPath = path.join(destDir, fileName);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log('Successfully copied PDF to public directory.');
    } else {
      console.warn('Source PDF not found at:', srcPath);
      console.log('Proceeding to update database anyway with expected local URL.');
    }

    // 2. Update Database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix');
    console.log('Connected to MongoDB');

    const grade = 8;
    const board = 'CBSE';
    const subjectRegex = new RegExp('^social science$', 'i');
    
    let doc = await Subject.findOne({ grade, board, subject: subjectRegex });

    if (!doc) {
      console.log('Document not found for Social Science, creating it...');
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
    const pdfUrl = `/uploads/pdfs/${fileName}`;

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
