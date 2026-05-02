/* ──────────────────────────────────────────────
   Routes — Study & API Endpoints
   ────────────────────────────────────────────── */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studyController');

// ── Pages ───────────────────────────────────
router.get('/',      ctrl.renderLanding);
router.get('/study', ctrl.renderStudy);

// ── API Endpoints ───────────────────────────
router.get('/api/subjects', ctrl.getSubjects);
router.get('/api/chapters', ctrl.getChapters);
router.get('/api/video',    ctrl.getVideo);

module.exports = router;
