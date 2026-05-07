const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// GET /getVideo?chapter=chapterName
router.get('/getVideo', videoController.getVideo);

module.exports = router;
