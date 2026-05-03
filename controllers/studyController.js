/* ──────────────────────────────────────────────
   Study Controller — All study-related logic
   ────────────────────────────────────────────── */

const Subject = require('../models/Subject');
const { fetchBestVideo } = require('../services/youtubeService');

// ── Curriculum mapping (example subjects per class + board) ──
const CURRICULUM = {
  8: {
    CBSE: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
    SSC:  ['Mathematics', 'General Science', 'Social Studies', 'English', 'Telugu'],
    ICSE: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']
  },
  9: {
    CBSE: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
    SSC:  ['Mathematics', 'Physical Science', 'Biological Science', 'Social Studies', 'English'],
    ICSE: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']
  },
  10: {
    CBSE: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
    SSC:  ['Mathematics', 'Physical Science', 'Biological Science', 'Social Studies', 'English'],
    ICSE: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']
  }
};

/**
 * GET /  — Render landing page
 */
exports.renderLanding = (req, res) => {
  res.render('landing');
};

/**
 * GET /classes  — Render class selection page (Step 1)
 */
exports.renderClasses = (req, res) => {
  res.render('classes');
};

/**
 * GET /boards  — Render board selection page (Step 2)
 * Query params: grade
 */
exports.renderBoards = (req, res) => {
  const { grade } = req.query;
  res.render('boards', {
    selectedGrade: grade || '8'
  });
};

/**
 * GET /subjects  — Render subjects page (Step 3)
 * Query params: grade, board
 */
exports.renderSubjects = (req, res) => {
  const { grade, board } = req.query;
  res.render('subjects', {
    selectedGrade: grade || '8',
    selectedBoard: board || 'CBSE'
  });
};

/**
 * GET /study  — Render study page (chapters, video player)
 * Query params: grade, board, subject
 */
exports.renderStudy = (req, res) => {
  const { grade, board, subject, language } = req.query;
  res.render('study', {
    selectedGrade:    grade || null,
    selectedBoard:    board || null,
    selectedSubject:  subject || null,
    selectedLanguage: language || null
  });
};

/**
 * GET /api/subjects?grade=8&board=CBSE
 * Returns list of subjects for a given class and board
 */
exports.getSubjects = (req, res) => {
  const { grade, board } = req.query;

  if (!grade || !board) {
    return res.status(400).json({ error: 'grade and board are required' });
  }

  const gradeNum = parseInt(grade, 10);
  const subjects = CURRICULUM[gradeNum]?.[board.toUpperCase()];

  if (!subjects) {
    return res.status(404).json({ error: 'No subjects found for this class and board' });
  }

  res.json({ grade: gradeNum, board: board.toUpperCase(), subjects });
};

/**
 * GET /api/chapters?grade=8&board=CBSE&subject=Mathematics
 * Returns chapters from MongoDB, or a default list if not seeded
 */
exports.getChapters = async (req, res) => {
  const { grade, board, subject } = req.query;

  if (!grade || !board || !subject) {
    return res.status(400).json({ error: 'grade, board, and subject are required' });
  }

  const gradeNum = parseInt(grade, 10);
  const boardUp = board.toUpperCase();

  try {
    const doc = await Subject.findOne(
      { grade: gradeNum, board: boardUp, subject },
      { 'units.unitName': 1, 'units.chapters.lessonNo': 1, 'units.chapters.chapterName': 1, 'units.chapters.type': 1, 'units.chapters.textbookContent': 1, 'units.chapters.keyMoments': 1, 'units.chapters.quizQuestions': 1, 'units.chapters.summary': 1 }
    ).lean();

    if (doc && doc.units && doc.units.length > 0) {
      const chapters = [];
      doc.units.forEach(unit => {
        unit.chapters.forEach(ch => {
          chapters.push({ 
            unitName: unit.unitName, 
            lessonNo: ch.lessonNo, 
            chapterName: ch.chapterName, 
            type: ch.type,
            textbookContent: ch.textbookContent,
            keyMoments: ch.keyMoments,
            quizQuestions: ch.quizQuestions,
            summary: ch.summary
          });
        });
      });
      return res.json({ grade: gradeNum, board: boardUp, subject, chapters });
    }
  } catch (err) {
    console.warn('getChapters DB lookup failed (MongoDB may be offline):', err.message);
  }

  // Fallback: return default chapters when DB is unavailable or not seeded
  res.json({
    grade: gradeNum,
    board: boardUp,
    subject,
    chapters: _getDefaultChapters(subject)
  });
};

/**
 * GET /api/video?chapter=Kinematics&grade=8&language=English&board=CBSE&subject=Science
 * 1. Checks MongoDB cache for existing video
 * 2. If not found, fetches from YouTube API
 * 3. Saves to MongoDB and returns embed data
 */
exports.getVideo = async (req, res) => {
  const { chapter, grade, language, board, subject } = req.query;

  if (!chapter || !grade || !language) {
    return res.status(400).json({ error: 'chapter, grade, and language are required' });
  }

  const gradeNum = parseInt(grade, 10);

  // ── Check MongoDB cache first ─────────────
  try {
    if (board && subject) {
      const doc = await Subject.findOne({
        grade: gradeNum,
        board: board.toUpperCase(),
        subject
      });

      if (doc) {
        for (const unit of doc.units) {
          for (const ch of unit.chapters) {
            if (ch.chapterName === chapter) {
              const cached = ch.videos.find(v => v.language === language);
              if (cached && cached.youtubeVideoId) {
                return res.json({
                  cached: true,
                  video: {
                    youtubeVideoId: cached.youtubeVideoId,
                    title:          cached.title,
                    viewCount:      cached.viewCount,
                    likeCount:      cached.likeCount,
                    embedUrl:       cached.embedUrl || `https://www.youtube.com/embed/${cached.youtubeVideoId}`
                  }
                });
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('getVideo DB cache lookup failed (MongoDB may be offline):', err.message);
  }

  // ── Fetch from YouTube API ────────────────
  try {
    const video = await fetchBestVideo(chapter, gradeNum, language, subject);

    if (!video) {
      return res.status(404).json({ error: 'No suitable video found' });
    }

    // ── Try to cache in MongoDB ──────────────
    if (board && subject) {
      try {
        await _cacheVideo(gradeNum, board.toUpperCase(), subject, chapter, language, video);
      } catch (cacheErr) {
        console.warn('Cache save skipped (MongoDB may be offline):', cacheErr.message);
      }
    }

    res.json({ cached: false, video });
  } catch (err) {
    console.error('getVideo error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Save a fetched video into the MongoDB document for future cache hits.
 */
async function _cacheVideo(grade, board, subject, chapterName, language, video) {
  try {
    let doc = await Subject.findOne({ grade, board, subject });

    if (!doc) {
      // Create a new document with the chapter and video
      doc = new Subject({
        grade,
        board,
        subject,
        units: [{
          unitName: 'General',
          chapters: [{
            chapterName,
            videos: [{
              language,
              youtubeVideoId: video.youtubeVideoId,
              title:          video.title,
              viewCount:      video.viewCount,
              likeCount:      video.likeCount,
              embedUrl:       video.embedUrl
            }]
          }]
        }]
      });
      await doc.save();
      return;
    }

    // Find or create the chapter, then push the video
    let found = false;
    for (const unit of doc.units) {
      for (const ch of unit.chapters) {
        if (ch.chapterName === chapterName) {
          // Remove existing video for this language if any
          ch.videos = ch.videos.filter(v => v.language !== language);
          ch.videos.push({
            language,
            youtubeVideoId: video.youtubeVideoId,
            title:          video.title,
            viewCount:      video.viewCount,
            likeCount:      video.likeCount,
            embedUrl:       video.embedUrl
          });
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      // Add chapter to first unit
      doc.units[0].chapters.push({
        chapterName,
        videos: [{
          language,
          youtubeVideoId: video.youtubeVideoId,
          title:          video.title,
          viewCount:      video.viewCount,
          likeCount:      video.likeCount,
          embedUrl:       video.embedUrl
        }]
      });
    }

    await doc.save();
  } catch (err) {
    console.error('Cache save error:', err.message);
  }
}

/**
 * Default chapters when MongoDB isn't seeded yet.
 */
function _getDefaultChapters(subject) {
  const defaults = {
    'Mathematics':      ['Number Systems', 'Algebra', 'Geometry', 'Mensuration', 'Statistics'],
    'Science':          ['Force and Motion', 'Light', 'Chemical Reactions', 'Cell Biology', 'Ecosystem'],
    'Social Science':   ['Indian History', 'Geography', 'Civics', 'Economics'],
    'English':          ['Grammar', 'Comprehension', 'Writing Skills', 'Literature'],
    'Hindi':            ['व्याकरण', 'गद्य', 'पद्य', 'लेखन'],
    'Physics':          ['Kinematics', 'Laws of Motion', 'Work and Energy', 'Waves', 'Optics'],
    'Chemistry':        ['Atoms and Molecules', 'Chemical Bonding', 'Acids and Bases', 'Metals and Non-Metals'],
    'Biology':          ['Cell Structure', 'Human Body Systems', 'Plant Physiology', 'Genetics', 'Ecology'],
    'General Science':  ['Force and Motion', 'Light and Sound', 'Chemical Changes', 'Living World'],
    'Social Studies':   ['History of India', 'World Geography', 'Indian Polity', 'Economics'],
    'Telugu':           ['వ్యాకరణం', 'గద్యం', 'పద్యం', 'రచన'],
    'Physical Science': ['Kinematics', 'Heat', 'Electricity', 'Chemical Reactions', 'Acids and Bases'],
    'Biological Science': ['Cell Biology', 'Plant Kingdom', 'Animal Kingdom', 'Human Physiology', 'Ecology']
  };

  return (defaults[subject] || ['Chapter 1', 'Chapter 2', 'Chapter 3'])
    .map((name, i) => ({ unitName: 'General', lessonNo: String(i + 1), chapterName: name, type: 'General Topic' }));
}
