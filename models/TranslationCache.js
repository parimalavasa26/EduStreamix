const mongoose = require('mongoose');

const translationCacheSchema = new mongoose.Schema({
  sourceText: { type: String, required: true },
  targetLang: { type: String, required: true },
  translatedText: { type: String, required: true }
}, { timestamps: true });

translationCacheSchema.index({ sourceText: 1, targetLang: 1 }, { unique: true });

module.exports = mongoose.model('TranslationCache', translationCacheSchema);
