/* ──────────────────────────────────────────────
   Mongoose Schema — Subject
   Supports: grade, board, subject, units, chapters, videos with language
   ────────────────────────────────────────────── */

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  language:       { type: String, enum: ['English', 'Hindi', 'Telugu'], required: true },
  youtubeVideoId: { type: String, required: true },
  title:          { type: String, default: '' },
  viewCount:      { type: Number, default: 0 },
  likeCount:      { type: Number, default: 0 },
  embedUrl:       { type: String, default: '' }
}, { _id: false });

const chapterSchema = new mongoose.Schema({
  lessonNo:    { type: String, default: '' },
  chapterName: { type: String, required: true },
  type:        { type: String, default: '' },
  videos:      [videoSchema]
}, { _id: false });

const unitSchema = new mongoose.Schema({
  unitName: { type: String, required: true },
  chapters: [chapterSchema]
}, { _id: false });

const subjectSchema = new mongoose.Schema({
  grade:   { type: Number, required: true, index: true },
  board:   { type: String, required: true, index: true },
  subject: { type: String, required: true },
  units:   [unitSchema]
}, { timestamps: true });

// Compound index for efficient querying
subjectSchema.index({ grade: 1, board: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
