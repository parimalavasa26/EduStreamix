/* ──────────────────────────────────────────────
   Mongoose Model — SSC Class 9 Syllabus
   Collection: ssc9
   
   Supports TWO data formats in the units array:
   - Flat:   { name, url }  (chapter stored directly)
   - Nested: { unit, chapters: [{ name, url }] }
   ────────────────────────────────────────────── */

const mongoose = require('mongoose');

const ssc9Schema = new mongoose.Schema({
  grade:   { type: Number, default: 9 },
  subject: { type: String, required: true },
  units:   { type: mongoose.Schema.Types.Mixed }
}, {
  collection: 'ssc9',
  timestamps: false,
  strict: false        // allow flexible/mixed document shapes
});

module.exports = mongoose.model('Ssc9', ssc9Schema);
