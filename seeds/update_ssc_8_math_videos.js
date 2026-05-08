require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Video = require('../models/Video');

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix';

const VIDEO_UPDATES = [
  { chapter: "Rational Numbers", videoId: "GJnvCdnrgqQ" },
  { chapter: "Linear Equations in One Variable", videoId: "39n_yvgBuVk" },
  { chapter: "Construction of Quadrilaterals", videoId: "8Am1CUdQOyk" },
  { chapter: "Exponents and Powers", videoId: "Z3pfh0s0DYg" },
  { chapter: "Comparing Quantities", videoId: "C_pVYSHv0mk" },
  { chapter: "Square Roots and Cube Roots", videoId: "WE5h9RB3aWk" },
  { chapter: "Frequency Distribution Tables and Graphs", videoId: "EAgtYwSk1lE" },
  { chapter: "Exploring Geometrical Figures", videoId: "3qYtJJQoIQc" },
  { chapter: "Area of Plane Figures", videoId: "aSgFqGrdIKY" },
  { chapter: "Direct and Inverse Proportions", videoId: "oCx6f3wNP1w" },
  { chapter: "Algebraic Expressions", videoId: "GQqQPY2wEQA" },
  { chapter: "Factorisation", videoId: "HD3z0c9obrA" },
  { chapter: "Visualizing 3-D in 2-D", videoId: "F0WEv5foLVE" },
  { chapter: "Surface Areas and Volumes", videoId: "2rp_-h6PnFo" },
  { chapter: "Playing with Numbers", videoId: "TgLC7rnGCCQ" }
];

async function updateVideos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB.');

    // 1. Update Subject model
    const subject = await Subject.findOne({ grade: 8, board: "SSC", subject: "Mathematics" });
    if (subject) {
      for (const update of VIDEO_UPDATES) {
        let found = false;
        for (const unit of subject.units) {
          for (const ch of unit.chapters) {
            if (ch.chapterName === update.chapter || (update.chapter === "Visualizing 3-D in 2-D" && ch.chapterName.includes("Visuali"))) {
              ch.videos = ch.videos.filter(v => v.language !== "English");
              ch.videos.push({
                language: "English",
                youtubeVideoId: update.videoId,
                title: ch.chapterName,
                embedUrl: `https://www.youtube.com/embed/${update.videoId}`
              });
              found = true;
              break;
            }
          }
          if (found) break;
        }
      }
      await subject.save();
      console.log('Updated Subject collection.');
    }

    // 2. Update Video model (Priority lookup)
    for (const update of VIDEO_UPDATES) {
      let finalChapterName = update.chapter;
      // If updating the "Visualizing" one, make sure it matches the Subject doc if possible
      if (update.chapter === "Visualizing 3-D in 2-D") {
         // keep it as is or try to match
      }

      await Video.findOneAndUpdate(
        { grade: "8", board: "SSC", subject: "Mathematics", chapter: finalChapterName },
        { 
          url: `https://www.youtube.com/embed/${update.videoId}`,
          language: "English"
        },
        { upsert: true, new: true }
      );
    }
    console.log('Updated Video collection (Priority mapping).');

    process.exit(0);
  } catch (error) {
    console.error('Error updating videos:', error);
    process.exit(1);
  }
}

updateVideos();
