const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  board: { type: String, required: true },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  url: { type: String, required: true },
  language: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
