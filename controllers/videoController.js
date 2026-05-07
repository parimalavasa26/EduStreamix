const Video = require('../models/Video');

/**
 * GET /getVideo?chapter=chapterName
 * Fetches matching chapter video from MongoDB
 */
exports.getVideo = async (req, res) => {
  try {
    const { chapter, grade, board, subject } = req.query;

    if (!chapter) {
      return res.status(400).json({ error: 'Chapter name is required' });
    }

    // Find the video by chapter name and optional filters
    const query = { chapter };
    if (grade) query.grade = grade;
    if (board) query.board = board.toUpperCase();
    if (subject) query.subject = subject;

    const video = await Video.findOne(query);

    if (!video) {
      return res.status(404).json({ error: `No video found for chapter: ${chapter}` });
    }

    // Return the matching video document as JSON
    res.json(video);
  } catch (error) {
    console.error('Error in getVideo controller:', error);
    res.status(500).json({ error: 'Internal server error while fetching video' });
  }
};
