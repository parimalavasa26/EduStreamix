/* ──────────────────────────────────────────────
   Study Controller — All study-related logic
   ────────────────────────────────────────────── */

const Subject = require('../models/Subject');
const { fetchBestVideo } = require('../services/youtubeService');
const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

// ── Curriculum mapping (example subjects per class + board) ──
const CURRICULUM = {
  8: {
    CBSE: ['Mathematics', 'Science', 'Social Science', 'Hindi', 'English'],
    SSC:  ['Mathematics', 'Physics', 'Biology', 'Social Studies', 'Hindi', 'Telugu', 'English'],
    ICSE: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']
  },
  9: {
    CBSE: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
    SSC:  ['Mathematics', 'Physical Science', 'Biological Science', 'Social Studies', 'English'],
    ICSE: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']
  },
  10: {
    CBSE: ['Mathematics', 'Science', 'History', 'Geography', 'Political Science', 'Economics'],
    SSC:  ['Mathematics', 'Physics', 'Biology', 'Social Studies', 'Telugu', 'Hindi-1', 'Hindi-2', 'English', 'Telugu-2'],
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
exports.renderStudy = (req, res) => {
  const { grade, board, subject, language } = req.query;
  res.render('study', {
    selectedGrade:    grade || null,
    selectedBoard:    board || null,
    selectedSubject:  subject || null,
    selectedLanguage: language || null,
    displaySubject:   subject || null
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
      { 'units.unitName': 1, 'units.chapters.lessonNo': 1, 'units.chapters.chapterName': 1, 'units.chapters.type': 1, 'units.chapters.pdfUrl': 1, 'units.chapters.pdfTitle': 1, 'units.chapters.keyMoments': 1, 'units.chapters.quizQuestions': 1, 'units.chapters.summary': 1 }
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
            pdfUrl: ch.pdfUrl,
            pdfTitle: ch.pdfTitle,
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
    chapters: _getDefaultChapters(subject, gradeNum, boardUp)
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
function _getDefaultChapters(subject, grade, board) {
  let defaults = {
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

  if (grade === 8 && board === 'CBSE') {
    defaults = {
      'Mathematics': [
        "Rational Numbers", "Powers and Exponents", "Squares and Square Roots", "Cubes and Cube Roots", "Algebraic Expressions", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Mensuration", "Data Handling", "Introduction to Graphs", "Comparing Quantities", "Direct and Inverse Proportions", "Visualising Patterns"
      ],
      'Science': [
        "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Synthetic Fibres and Plastics", "Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Cell - Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Microorganisms: Friend and Foe", "Pollution of Air and Water", "Some Natural Phenomena", "Light", "Stars and The Solar System", "Conservation of Plants and Animals"
      ],
      'Social Science': [
        "How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age", "When People Rebel (1857 and After)", "Colonialism and the City", "Weavers, Iron Smelters and Factory Owners", "Civilising the “Native”, Educating the Nation", "Women, Caste and Reform", "The Changing World of Visual Arts", "The Making of the National Movement (1870–1947)", "India After Independence", "Resources", "Land, Soil, Water, Natural Vegetation and Wildlife Resources", "Mineral and Power Resources", "Agriculture", "Industries", "Human Resources", "The Indian Constitution", "Understanding Secularism", "Why Do We Need a Parliament?", "Understanding Laws", "Judiciary", "Understanding Our Criminal Justice System", "Understanding Marginalisation", "Confronting Marginalisation", "Public Facilities", "Law and Social Justice", "The Story of Village Palampur", "Role of the Government in Health", "How the Markets Work", "Globalisation and the Indian Economy", "Public Distribution System"
      ],
      'Hindi': [
        "स्वदेश", "दो गौरैया", "मित्रलाभ", "एक आशीर्वाद", "हरिद्वार", "कबीर के दोहे", "कदम मिलाकर चलना होगा", "एक टोकरी भर मिट्टी", "मत बाँधो", "नए मेहमान", "आदमी के अनुपात", "तरुण के स्वप्न", "भारती जब विषय करो"
      ],
      'English': [
        "The Wit that Won Hearts", "A Concrete Example", "Wisdom Paves the Way", "A Tale of Valour: Major Somnath Sharma and the Battle of Badgam", "Somebody’s Mother", "Verghese Kurien – I Too Had a Dream", "The Case of the Fifth Word", "The Magic Brush of Dreams", "The Cherry Tree", "Harvest Hymn", "Feathered Friend", "Magnifying Glass", "Bibha Chowdhuri: The Beam of Light that Lit the Path for Women in Indian Science"
      ]
    };
  } else if (grade === 8 && board === 'SSC') {
    defaults = {
      'Mathematics': [
        "Rational Numbers", "Linear Equations in One Variable", "Construction of Quadrilaterals", "Exponents and Powers", "Comparing Quantities using Proportion", "Square Roots and Cube Roots", "Frequency Distribution Tables and Graphs", "Exploring Geometrical Figures", "Area of Plane Figures", "Direct and Inverse Proportions", "Algebraic Expressions", "Factorisation", "Visualizing 3-D in 2-D", "Surface Areas and Volumes (Cube-Cuboid)", "Playing with Numbers"
      ],
      'Physics': [
        "Force", "Friction", "Synthetic Fibres and Plastics", "Metals and Non metals", "Sound", "Reflection of Light at plane surfaces", "Coal and Petroleum", "Combustion, Fuels and flame", "Electrical Conductivity of Liquids", "Some natural phenomena", "Stars and the Solar system", "Graphs of Motion"
      ],
      'Biology': [
        "What is Science ?", "Cell - The Basic Unit of Life", "Microbial World -1", "Microbial World - 2", "Reproduction in Animals", "Adolescence", "Biodiversity and its Conservation", "Different Ecosystems", "Food Production from plants", "Food Production from animals", "Not for Drinking - Not for Breathing", "Why do we fall ill ?"
      ],
      'Social Studies': [
        "Reading and Analysis of Maps", "Energy from the Sun", "Earth Movements and Seasons", "The Polar Regions", "Forests : Using and Protecting Them", "Minerals and Mining", "Money and Banking", "Impact of Technology on Livelihoods", "Public Health and the Government", "Landlords and Tenants under the British and the Nizam", "National Movement – The Early Phase – 1885-1919", "National Movement – The Last Phase 1919-1947", "Freedom Movement in Hyderabad State", "The Indian Constitution", "Parliament and Central Government", "Law and Justice – A Case Study", "Abolition of Zamindari System", "Understanding Poverty", "Rights Approach to Development", "Social and Religious Reform Movements", "Understanding Secularism", "Performing Arts and Artistes in Modern Times", "Film and Print Media", "Sports : Nationalism and Commerce", "Disaster management"
      ],
      'Hindi': [
        "बरसते बादल", "लाख की चूड़ियाँ", "बस की यात्रा", "दीवानों की हस्ती", "खेल जहाँ, मैदान वहाँ", "चिड़ियों की अनूठी दुनिया", "अरमान", "कामचोर", "क्या निराश हुआ जाए", "शुक्रिया निकुम्भ सर", "कबीर की साखियाँ", "जब सिनेमा ने बोलना सीखा", "दो कलाकार", "सुदामा चरित", "जहाँ पहिया है", "पानी की कहानी", "हमारा संकल्प", "सूरदास के पद", "बाज़ और साँप", "पहाड़ से ऊँचा आदमी"
      ],
      'Telugu': [
        "త్యాగనిరతి", "సముద్ర ప్రయాణం", "బండారి బసవన్న", "అసామాన్యులు", "శతకసుధ", "తెలుగు జానపద గేయాలు", "మంజీరా", "చిన్నప్పుడే", "అమరులు", "సింగరేణి", "కాపుబిడ్డ", "మాట్లాడే నాగలి"
      ],
      'English': [
        "The Tattered Blanket", "My Mother (Poem)", "Letter to a Friend", "Oliver Asks for More", "The Cry of Children (Poem)", "Reaching the Unreached", "The Selfish Giant (Part I)", "The Selfish Giant (Part II)", "The Garden Within (Poem)", "The Fun They Had", "Preteen Pretext (Poem)", "The Computer Game", "The Treasure Within – Part I", "The Treasure Within – Part II", "They Literally Build the Nation", "The Story of Ikat", "The Earthen Goblet (Poem)", "Maestro with a Mission", "Bonsai Life – Part I", "Bonsai Life – Part II", "I Can Take Care of Myself", "Dr. Dwarakanath Kotnis", "Be Thankful (Poem)", "The Dead Rat"
      ]
    };
  } else if (grade === 10 && board === 'CBSE') {
    defaults = {
      'Mathematics': [
        "Number Systems", "Algebra", "Coordinate Geometry", "Geometry", "Trigonometry", "Mensuration", "Statistics and Probability"
      ],
      'Science': [
        "Chemical Substances - Nature and Behaviour", "World of Living", "Natural Phenomena", "Effects of Current", "Natural Resources"
      ],
      'History': [
        "The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Print Culture and the Modern World"
      ],
      'Geography': [
        "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Lifelines of National Economy"
      ],
      'Political Science': [
        "Power Sharing", "Federalism", "Gender, Religion and Caste", "Political Parties", "Outcomes of Democracy"
      ],
      'Economics': [
        "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy", "Consumer Rights"
      ]
    };
  } else if (grade === 10 && board === 'SSC') {
    defaults = {
      'Mathematics': [
        "Real Numbers", "Sets", "Polynomials", "Linear Equations in Two Variables", "Quadratic Equations", "Progressions", "Coordinate Geometry", "Similar Triangles", "Tangents and Secants to Circles", "Mensuration", "Trigonometry", "Applications of Trigonometry", "Probability", "Statistics"
      ],
      'Physics': [
        "Reflection of Light at Curved Surfaces", "Refraction of Light at Curved Surfaces", "Human Eye and Colourful World", "Electric Current", "Electromagnetism", "Chemical Equations", "Acids, Bases and Salts", "Structure of Atom", "Classification of Elements–the Periodic Table", "Chemical Bonding", "Principles of Metallurgy", "Carbon and Its Compounds"
      ],
      'Biology': [
        "Nutrition", "Respiration", "Transportation", "Excretion", "Coordination", "Reproduction", "Heredity and Evolution", "Our Environment", "Natural Resources"
      ],
      'Social Studies': [
        "India: Relief Features", "Ideas of Development", "Production and Employment", "Climate of India", "Indian Rivers and Water Resources", "The Population", "Settlements and Migration", "Rampur: A Village Economy", "Globalisation", "Food Security", "Sustainable Development with Equity", "World Between the World Wars", "National Liberation Movements in the Colonies", "National Movement in India – Partition & Independence (1939–1947)", "The Making of Independent India’s Constitution", "Election Process in India", "Independent India (1947–77)", "Emerging Political Trends (1977–2000)", "Post-War World and India", "Social Movements in Our Times", "The Movement for the Formation of Telangana State"
      ],
      'Telugu': [
        "దానశీలము", "ఎవరికి బాధ మించదు", "వీర తెలంగాణ", "కృష్ణదేవరాయలు", "నగరగీతం", "భాగ్యోదయం", "శతక మాధుర్యం", "లక్ష్మీదేవి", "టీవీభాష్యం", "గోలకొండ పట్టణం", "భిక్ష", "భూమిక", "రామాయణం"
      ],
      'Hindi-2': [
        "बरसते बादल", "ईदगाह", "माँ मुझे आने दे", "कण-कण का अधिकारी", "लोकगीत", "अंतर्राष्ट्रीय स्तर पर हिंदी", "भक्ति पद", "स्वराज्य की नींव", "दक्षिणी गंगा गोदावरी", "नीति दोहे", "जल ही जीवन है", "धरती के सवाल, अंतरिक्ष के जवाब"
      ],
      'English': [
        "Attitude is Altitude", "Every Success Story is also a Story of Great Failures", "I Will Do It", "The Dear Departed – I", "The Dear Departed – II", "The Brave Potter", "The Journey", "Another Woman", "The Never Never Nest", "Rendezvous with Ray", "Maya Bazaar", "A Tribute", "The Storeyed House – I", "The Storeyed House – II", "Abandoned", "Environment", "Or Will the Dreamer Wake", "My Childhood", "A Plea for India", "Unity in Diversity", "Jamaican Fragment", "Once Upon a Time", "What is My Name?"
      ],
      'Hindi-1': [
        "सुंदर भारत", "नेताजी का चश्मा", "एक कहानी यह भी", "मंगल, मानव और मशीन", "कविता", "गोपी का फूल", "राम-लक्ष्मण-परशुराम संवाद", "बड़े भाई साहब", "अभिव्यक्ति"
      ],
      'Telugu-2': [
        "భారతదేశ రత్నాలు", "పర్యావరణం", "ధర్మాలు", "బాలసురక్షిత పథకం", "సత్కర్మలు", "మహిళా సాధికారత", "పరోపకారం", "వ్యవసాయ పథకాలు"
      ]
    };
  }

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

    if (reqLang === 'en' || reqLang === 'English') {
      const fallback = {};
      texts.forEach(t => fallback[t] = t);
      return res.json(fallback);
    }
    
    const langCodes = { 'English':'en', 'Hindi':'hi', 'Telugu':'te', 'Tamil':'ta', 'Kannada':'kn', 'Malayalam':'ml' };
    const target = langCodes[reqLang] || reqLang;
    
    // Robust parallel translation block
    const promises = texts.map(async (text) => {
      if (!text || text === '-') {
        return { original: text, translated: text };
      }
      try {
        const response = await translate(text, { to: target });
        return { original: text, translated: response.text };
      } catch (innerErr) {
        console.error("Error translating:", text);
        return { original: text, translated: text }; // fallback
      }
    });

    const resolved = await Promise.all(promises);
    const results = {};
    resolved.forEach(r => {
      results[r.original] = r.translated;
    });

    res.json(results);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
};
