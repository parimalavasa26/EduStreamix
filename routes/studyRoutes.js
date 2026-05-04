/* ──────────────────────────────────────────────
   Routes — Study & API Endpoints
   ────────────────────────────────────────────── */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studyController');

// ── Pages ───────────────────────────────────
router.get('/',         ctrl.renderLanding);
router.get('/classes',  ctrl.renderClasses);
router.get('/boards',   ctrl.renderBoards);
router.get('/languages', ctrl.renderLanguages);
router.get('/subjects', ctrl.renderSubjects);
router.get('/study',    ctrl.renderStudy);

// ── API Endpoints ───────────────────────────
router.get('/api/subjects', ctrl.getSubjects);
router.get('/api/chapters', ctrl.getChapters);
router.get('/api/video',    ctrl.getVideo);

// Translation endpoint
router.post('/translate-batch', ctrl.translateBatch);
router.post('/api/upload-pdf', ctrl.uploadPdf);

// ── Admin ───────────────────────────────────
router.get('/admin', ctrl.renderAdmin);

module.exports = router;
