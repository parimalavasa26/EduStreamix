const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/generate-test', quizController.generateTest);

module.exports = router;
