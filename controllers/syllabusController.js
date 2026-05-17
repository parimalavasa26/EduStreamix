/* ──────────────────────────────────────────────
   Syllabus Controller — SSC9 & CBSE9 data
   ────────────────────────────────────────────── */

const Ssc9  = require('../models/Ssc9');
const Cbse9 = require('../models/Cbse9');
const Icse9 = require('../models/Icse9');

/**
 * Helper: pick the right model based on board string
 */
function getModel(board) {
  const b = (board || '').toLowerCase().trim();
  if (b === 'ssc')  return Ssc9;
  if (b === 'cbse') return Cbse9;
  if (b === 'icse') return Icse9;
  return null;
}

/**
 * GET /api/syllabus/:board/subjects
 * Returns all subjects (with full units & chapters) for a board.
 */
exports.getAllSubjects = async (req, res) => {
  try {
    const Model = getModel(req.params.board);
    if (!Model) {
      return res.status(400).json({ error: 'Invalid board. Use "ssc" or "cbse".' });
    }

    const docs = await Model.find({}).lean();

    if (!docs || docs.length === 0) {
      return res.status(404).json({ error: `No data found in ${req.params.board}9 collection.` });
    }

    res.json({
      board: req.params.board.toUpperCase(),
      count: docs.length,
      subjects: docs
    });
  } catch (err) {
    console.error('getAllSubjects error:', err.message);
    res.status(500).json({ error: 'Failed to fetch subjects.' });
  }
};

/**
 * GET /api/syllabus/:board/subject/:subjectName
 * Returns a single subject document with its units and chapters.
 */
exports.getSubjectByName = async (req, res) => {
  try {
    const Model = getModel(req.params.board);
    if (!Model) {
      return res.status(400).json({ error: 'Invalid board. Use "ssc" or "cbse".' });
    }

    const subjectName = req.params.subjectName;

    // Case-insensitive search
    const doc = await Model.findOne({
      subject: { $regex: new RegExp(`^${subjectName}$`, 'i') }
    }).lean();

    if (!doc) {
      return res.status(404).json({ error: `Subject "${subjectName}" not found.` });
    }

    res.json(doc);
  } catch (err) {
    console.error('getSubjectByName error:', err.message);
    res.status(500).json({ error: 'Failed to fetch subject.' });
  }
};

/**
 * GET /api/syllabus/:board/search?q=keyword
 * Searches chapter names across all subjects for a board.
 */
exports.searchChapters = async (req, res) => {
  try {
    const Model = getModel(req.params.board);
    if (!Model) {
      return res.status(400).json({ error: 'Invalid board. Use "ssc" or "cbse".' });
    }

    const query = (req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Search query "q" is required.' });
    }

    const regex = new RegExp(query, 'i');

    const docs = await Model.find({
      $or: [
        { subject: regex },
        { 'units.unit': regex },
        { 'units.name': regex },
        { 'units.chapters.name': regex }
      ]
    }).lean();

    // Flatten results — handle both flat and nested formats
    const results = [];
    docs.forEach(doc => {
      (doc.units || []).forEach(unit => {
        if (unit.chapters && Array.isArray(unit.chapters)) {
          // Nested format: {unit, chapters: [{name, url}]}
          unit.chapters.forEach(ch => {
            if (regex.test(ch.name) || regex.test(unit.unit) || regex.test(doc.subject)) {
              results.push({
                subject: doc.subject,
                unit: unit.unit || 'All Chapters',
                chapter: ch.name,
                url: ch.url
              });
            }
          });
        } else if (unit.name) {
          // Flat format: each unit IS a chapter {name, url}
          if (regex.test(unit.name) || regex.test(doc.subject)) {
            results.push({
              subject: doc.subject,
              unit: 'All Chapters',
              chapter: unit.name,
              url: unit.url
            });
          }
        }
      });
    });

    res.json({
      board: req.params.board.toUpperCase(),
      query,
      count: results.length,
      results
    });
  } catch (err) {
    console.error('searchChapters error:', err.message);
    res.status(500).json({ error: 'Search failed.' });
  }
};

/**
 * GET /syllabus  — Render the syllabus browser page
 */
exports.renderSyllabus = (req, res) => {
  res.render('syllabus');
};

/**
 * GET /api/syllabus/9/all
 * Returns all subjects grouped by board
 */
exports.getAllClass9Data = async (req, res) => {
  try {
    const sscDocs = await Ssc9.find({}).lean();
    const cbseDocs = await Cbse9.find({}).lean();
    const icseDocs = await Icse9.find({}).lean();

    res.json({
      grade: 9,
      boards: {
        CBSE: cbseDocs || [],
        SSC: sscDocs || [],
        ICSE: icseDocs || []
      }
    });
  } catch (err) {
    console.error('getAllClass9Data error:', err.message);
    res.status(500).json({ error: 'Failed to fetch unified syllabus data.' });
  }
};
