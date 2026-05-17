/* ──────────────────────────────────────────────
   Routes — Syllabus API (SSC9 / CBSE9)
   ────────────────────────────────────────────── */

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/syllabusController');

// ── Page ────────────────────────────────────
router.get('/syllabus', ctrl.renderSyllabus);

// ── API ─────────────────────────────────────
router.get('/api/syllabus/:board/subjects',          ctrl.getAllSubjects);
router.get('/api/syllabus/:board/subject/:subjectName', ctrl.getSubjectByName);
router.get('/api/syllabus/:board/search',            ctrl.searchChapters);
router.get('/api/syllabus/9/all',                    ctrl.getAllClass9Data);

module.exports = router;
