/* ──────────────────────────────────────────────
   Mongoose Model — CBSE Class 9 Syllabus
   Collection: cbse9
   
   Supports TWO data formats in the units array:
   - Flat:   { name, url }  (chapter stored directly)
   - Nested: { unit, chapters: [{ name, url }] }
   ────────────────────────────────────────────── */

const mongoose = require('mongoose');

const cbse9Schema = new mongoose.Schema({
  grade:   { type: Number, default: 9 },
  subject: { type: String, required: true },
  units:   { type: mongoose.Schema.Types.Mixed }
}, {
  collection: 'cbse9',
  timestamps: false,
  strict: false
});

module.exports = mongoose.model('Cbse9', cbse9Schema);
