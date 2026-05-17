/* ──────────────────────────────────────────────
   Mongoose Model — ICSE Class 9 Syllabus
   Collection: icse9
   
   Supports TWO data formats in the units array:
   - Flat:   { name, url }  (chapter stored directly)
   - Nested: { unit, chapters: [{ name, url }] }
   ────────────────────────────────────────────── */

const mongoose = require('mongoose');

const icse9Schema = new mongoose.Schema({
  grade:   { type: Number, default: 9 },
  subject: { type: String, required: true },
  units:   { type: mongoose.Schema.Types.Mixed }
}, {
  collection: 'icse9',
  timestamps: false,
  strict: false        // allow flexible/mixed document shapes
});

module.exports = mongoose.model('Icse9', icse9Schema);
