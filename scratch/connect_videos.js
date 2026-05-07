const mongoose = require('mongoose');
const Subject = require('../models/Subject');
require('dotenv').config({ path: '../.env' });

/**
 * This script helps you connect YouTube URLs to your chapters in bulk.
 * Edit the VIDEO_MAPPING array with your actual data.
 */

const VIDEO_MAPPING = [
  {
    grade: 8,
    board: 'CBSE',
    subject: 'Social Science',
    chapterName: 'How, When and Where',
    language: 'English',
    youtubeVideoId: 'dQw4w9WgXcQ' // Replace with your actual ID
  }
];

async function connectVideos() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/edustreamix';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB:', uri);

    for (const item of VIDEO_MAPPING) {
      const { grade, board, subject, chapterName, language, youtubeVideoId } = item;
      
      const boardUp = board.toUpperCase();
      let doc = await Subject.findOne({ grade, board: boardUp, subject });

      if (!doc) {
        console.log(`Subject not found: ${grade} ${boardUp} ${subject}`);
        continue;
      }

      let found = false;
      for (const unit of doc.units) {
        for (const ch of unit.chapters) {
          if (ch.chapterName === chapterName) {
            // Remove existing video for this language if any
            ch.videos = ch.videos.filter(v => v.language !== language);
            ch.videos.push({
              language,
              youtubeVideoId,
              title: `${chapterName} (${language})`,
              embedUrl: `https://www.youtube.com/embed/${youtubeVideoId}`
            });
            found = true;
            console.log(`✅ Connected: ${chapterName} -> ${youtubeVideoId} (${language})`);
            break;
          }
        }
        if (found) break;
      }

      if (!found) {
        console.log(`❌ Chapter not found: ${chapterName} in ${subject}`);
      }

      await doc.save();
    }

    console.log('\nFinished connecting videos.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

connectVideos();
