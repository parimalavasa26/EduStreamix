const Video = require('../models/Video');

/**
 * GET /getVideo?chapter=chapterName
 * Fetches matching chapter video from MongoDB
 */
exports.getVideo = async (req, res) => {
  try {
    const { chapter } = req.query;

    if (!chapter) {
      return res.status(400).json({ error: 'Chapter name is required' });
    }

    // Find the video by chapter name
    const video = await Video.findOne({ chapter: chapter });

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
