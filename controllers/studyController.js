/* ──────────────────────────────────────────────
   Study Controller — All study-related logic
   ────────────────────────────────────────────── */

const Subject = require('../models/Subject');
const TranslationCache = require('../models/TranslationCache');
const { fetchBestVideo } = require('../services/youtubeService');
const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const LANG_CODES = { 'English':'en', 'Hindi':'hi', 'Telugu':'te', 'Tamil':'ta', 'Kannada':'kn', 'Malayalam':'ml' };

async function getTranslatedTexts(texts, targetLang) {
  if (!texts || texts.length === 0 || targetLang === 'en' || targetLang === 'English') {
    const fallback = {};
    texts.forEach(t => fallback[t] = t);
    return fallback;
  }

  const target = LANG_CODES[targetLang] || targetLang;
  const uniqueTexts = [...new Set(texts.filter(t => t && t !== '-'))];
  const results = {};
  
  // 1. Check Cache
  const cachedDocs = await TranslationCache.find({ 
    sourceText: { $in: uniqueTexts }, 
    targetLang: target 
  }).lean();
  
  const toTranslate = [];
  uniqueTexts.forEach(t => {
    const found = cachedDocs.find(c => c.sourceText === t);
    if (found) results[t] = found.translatedText;
    else toTranslate.push(t);
  });

  // 2. Translate Missing
  if (toTranslate.length > 0) {
    for (let i = 0; i < toTranslate.length; i += 5) {
      const chunk = toTranslate.slice(i, i + 5);
      try {
        const response = await translate(chunk, { to: target });
        const resArray = Array.isArray(response) ? response : [response];
        
        const newCacheDocs = [];
        chunk.forEach((t, j) => {
          results[t] = resArray[j].text;
          newCacheDocs.push({ sourceText: t, targetLang: target, translatedText: resArray[j].text });
        });
        
        // Save to cache
        if (newCacheDocs.length > 0) {
          await TranslationCache.insertMany(newCacheDocs, { ordered: false }).catch(() => {});
        }
      } catch (err) {
        console.error("Backend translation error:", err.message || err);
        chunk.forEach(t => { results[t] = t; }); // fallback
      }
    }
  }

  // Ensure all original texts are in results
  texts.forEach(t => {
    if (!results[t]) results[t] = t;
  });

  return results;
}

// ── Curriculum mapping (example subjects per class + board) ──
const CURRICULUM = {
  8: {
    CBSE: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
    SSC:  ['Telugu', 'Hindi', 'English', 'Mathematics', 'Physical Science', 'Biological Science', 'Social Studies'],
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
 * GET /languages  — Render language selection page (Step 3)
 * Query params: grade, board
 */
exports.renderLanguages = (req, res) => {
  const { grade, board } = req.query;
  res.render('languages', {
    selectedGrade: grade || '8',
    selectedBoard: board || 'CBSE'
  });
};

/**
 * GET /subjects  — Render subjects page (Step 3)
 * Query params: grade, board
 */
exports.renderSubjects = (req, res) => {
  const { grade, board, language } = req.query;
  res.render('subjects', {
    selectedGrade: grade || '8',
    selectedBoard: board || 'CBSE',
    selectedLanguage: language || 'English'
  });
};

/**
 * GET /study  — Render study page (chapters, video player)
 * Query params: grade, board, subject
 */
exports.renderStudy = async (req, res) => {
  const { grade, board, subject, language } = req.query;
  let displaySubject = subject || 'Subject';
  
  if (language && language !== 'English' && language !== 'en') {
     try {
       const translations = await getTranslatedTexts([displaySubject], language);
       displaySubject = translations[displaySubject] || displaySubject;
     } catch(e) {}
  }

  res.render('study', {
    selectedGrade:    grade || null,
    selectedBoard:    board || null,
    selectedSubject:  subject || null,
    displaySubject:   displaySubject,
    selectedLanguage: language || null
  });
};

/**
 * GET /api/subjects?grade=8&board=CBSE&lang=Telugu
 * Returns list of subjects for a given class and board, translated if needed.
 */
exports.getSubjects = async (req, res) => {
  const { grade, board, lang } = req.query;

  if (!grade || !board) {
    return res.status(400).json({ error: 'grade and board are required' });
  }

  const gradeNum = parseInt(grade, 10);
  const subjects = CURRICULUM[gradeNum]?.[board.toUpperCase()];

  if (!subjects) {
    return res.status(404).json({ error: 'No subjects found for this class and board' });
  }

  try {
    const translations = await getTranslatedTexts(subjects, lang || 'English');
    const translatedSubjects = subjects.map(s => translations[s] || s);
    res.json({ grade: gradeNum, board: board.toUpperCase(), subjects: translatedSubjects, originalSubjects: subjects });
  } catch (err) {
    res.json({ grade: gradeNum, board: board.toUpperCase(), subjects, originalSubjects: subjects });
  }
};

/**
 * GET /api/chapters?grade=8&board=CBSE&subject=Mathematics&lang=Telugu
 * Returns chapters from MongoDB, translated if needed
 */
exports.getChapters = async (req, res) => {
  const { grade, board, subject, lang } = req.query;

  if (!grade || !board || !subject) {
    return res.status(400).json({ error: 'grade, board, and subject are required' });
  }

  const gradeNum = parseInt(grade, 10);
  const boardUp = board.toUpperCase();
  let chapters = [];

  try {
    const doc = await Subject.findOne(
      { grade: gradeNum, board: boardUp, subject },
      { 'units.unitName': 1, 'units.chapters.lessonNo': 1, 'units.chapters.chapterName': 1, 'units.chapters.type': 1, 'units.chapters.pdfUrl': 1, 'units.chapters.pdfTitle': 1, 'units.chapters.keyMoments': 1, 'units.chapters.quizQuestions': 1, 'units.chapters.summary': 1 }
    ).lean();

    if (doc && doc.units && doc.units.length > 0) {
      doc.units.forEach(unit => {
        unit.chapters.forEach(ch => {
          chapters.push({ 
            unitName: unit.unitName, 
            lessonNo: ch.lessonNo, 
            chapterName: ch.chapterName, 
            type: ch.type,
            pdfUrl: ch.pdfUrl,
            pdfTitle: ch.pdfTitle,
            keyMoments: ch.keyMoments,
            quizQuestions: ch.quizQuestions,
            summary: ch.summary,
            originalChapterName: ch.chapterName // Keep original for video fetching
          });
        });
      });
    }
  } catch (err) {
    console.warn('getChapters DB lookup failed (MongoDB may be offline):', err.message);
  }

  if (chapters.length === 0) {
    chapters = _getDefaultChapters(subject).map(ch => ({ ...ch, originalChapterName: ch.chapterName }));
  }

  // Translate
  try {
    const targetLang = lang || 'English';
    if (targetLang !== 'English' && targetLang !== 'en') {
      const textsToTranslate = [];
      chapters.forEach(ch => {
        textsToTranslate.push(ch.unitName, ch.chapterName, ch.type);
      });
      const translations = await getTranslatedTexts(textsToTranslate, targetLang);
      
      chapters = chapters.map(ch => ({
        ...ch,
        unitName: translations[ch.unitName] || ch.unitName,
        chapterName: translations[ch.chapterName] || ch.chapterName,
        type: translations[ch.type] || ch.type
      }));
    }
  } catch (err) {
    console.warn('Translation failed:', err.message);
  }

  res.json({ grade: gradeNum, board: boardUp, subject, chapters });
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

/**
 * GET /admin  — Render Admin Page
 */
exports.renderAdmin = (req, res) => {
  res.render('admin');
};

/**
 * POST /api/upload-pdf
 * Handles base64 PDF upload and updates the MongoDB schema
 */
exports.uploadPdf = async (req, res) => {
  const { grade, board, subject, chapterName, pdfDataUrl, pdfTitle } = req.body;

  if (!grade || !board || !subject || !chapterName || !pdfDataUrl) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // 1. Decode Base64 PDF
    const matches = pdfDataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 string' });
    }

    const buffer = Buffer.from(matches[2], 'base64');

    // 2. Save PDF to disk
    const uploadDir = path.join(__dirname, '../public/uploads/pdfs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeChapter = chapterName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `grade${grade}_${board}_${subject.replace(/\\s/g, '')}_${safeChapter}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);
    const pdfUrl = `/uploads/pdfs/${fileName}`;

    // 3. Update MongoDB Subject Chapter
    const gradeNum = parseInt(grade, 10);
    const boardUp = board.toUpperCase();

    let doc = await Subject.findOne({ grade: gradeNum, board: boardUp, subject });
    
    if (!doc) {
      // Create a default if doesn't exist
      doc = new Subject({
        grade: gradeNum,
        board: boardUp,
        subject,
        units: [{
          unitName: 'General',
          chapters: [{
            chapterName,
            pdfUrl,
            pdfTitle: pdfTitle || chapterName
          }]
        }]
      });
      await doc.save();
    } else {
      let found = false;
      for (const unit of doc.units) {
        for (const ch of unit.chapters) {
          if (ch.chapterName === chapterName) {
            ch.pdfUrl = pdfUrl;
            ch.pdfTitle = pdfTitle || chapterName;
            found = true;
            break;
          }
        }
        if (found) break;
      }

      if (!found) {
        doc.units[0].chapters.push({
          chapterName,
          pdfUrl,
          pdfTitle: pdfTitle || chapterName
        });
      }

      await doc.save();
    }

    res.json({ success: true, pdfUrl });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
};

/**
 * POST /translate-batch
 * Batch translates array of strings
 */
exports.translateBatch = async (req, res) => {
  try {
    const { texts, lang, targetLang } = req.body;
    const reqLang = targetLang || lang;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: "Invalid texts array" });
    }

    const results = await getTranslatedTexts(texts, reqLang);
    res.json(results);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
};
