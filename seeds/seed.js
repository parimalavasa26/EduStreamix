/* ════════════════════════════════════════════════
   Seed Script — Sample data for Class 8, 9, 10 (CBSE)
   Run: npm run seed
   ════════════════════════════════════════════════ */

require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

const SEED_DATA = [
  // ── Class 8 CBSE ──────────────────────────
  {
    grade: 8, board: 'CBSE', subject: 'Mathematics',
    units: [
      {
        unitName: 'Number System',
        chapters: [
          {
            chapterName: 'Rational Numbers',
            videos: [
              { language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Rational Numbers - Class 8 (English)', viewCount: 150000, likeCount: 4200, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
              { language: 'Hindi', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Rational Numbers - Class 8 (Hindi)', viewCount: 120000, likeCount: 3800, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
              { language: 'Telugu', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Rational Numbers - Class 8 (Telugu)', viewCount: 80000, likeCount: 2100, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
            ]
          },
          {
            chapterName: 'Linear Equations in One Variable',
            videos: [
              { language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Linear Equations - Class 8 (English)', viewCount: 200000, likeCount: 5600, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
            ]
          }
        ]
      },
      {
        unitName: 'Geometry',
        chapters: [
          {
            chapterName: 'Understanding Quadrilaterals',
            videos: [
              { language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Quadrilaterals - Class 8 (English)', viewCount: 95000, likeCount: 2800, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
            ]
          }
        ]
      }
    ]
  },
  {
    grade: 8, board: 'CBSE', subject: 'Science',
    units: [
      {
        unitName: 'Physics',
        chapters: [
          {
            chapterName: 'Force and Pressure',
            videos: [
              { language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Force and Pressure - Class 8 (English)', viewCount: 180000, likeCount: 5100, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
              { language: 'Hindi', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Force and Pressure - Class 8 (Hindi)', viewCount: 140000, likeCount: 4000, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
            ]
          },
          {
            chapterName: 'Friction',
            videos: [
              { language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Friction - Class 8 (English)', viewCount: 160000, likeCount: 4500, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
            ]
          }
        ]
      },
      {
        unitName: 'Chemistry',
        chapters: [
          {
            chapterName: 'Synthetic Fibres and Plastics',
            videos: [
              { language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Synthetic Fibres - Class 8 (English)', viewCount: 110000, likeCount: 3200, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
            ]
          }
        ]
      }
    ]
  },

  // ── Class 9 CBSE ──────────────────────────
  {
    grade: 9, board: 'CBSE', subject: 'Mathematics',
    units: [
      {
        unitName: 'Number Systems',
        chapters: [
          { chapterName: 'Number Systems', videos: [{ language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Number Systems - Class 9', viewCount: 220000, likeCount: 6100, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] },
          { chapterName: 'Polynomials', videos: [{ language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Polynomials - Class 9', viewCount: 190000, likeCount: 5300, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
        ]
      }
    ]
  },
  {
    grade: 9, board: 'CBSE', subject: 'Science',
    units: [
      {
        unitName: 'Physics',
        chapters: [
          { chapterName: 'Motion', videos: [{ language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Motion - Class 9', viewCount: 300000, likeCount: 8500, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] },
          { chapterName: 'Force and Laws of Motion', videos: [{ language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Force and Laws - Class 9', viewCount: 280000, likeCount: 7800, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
        ]
      }
    ]
  },

  // ── Class 10 CBSE ─────────────────────────
  {
    grade: 10, board: 'CBSE', subject: 'Mathematics',
    units: [
      {
        unitName: 'Algebra',
        chapters: [
          { chapterName: 'Real Numbers', videos: [{ language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Real Numbers - Class 10', viewCount: 350000, likeCount: 9800, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] },
          { chapterName: 'Pair of Linear Equations', videos: [{ language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Linear Equations - Class 10', viewCount: 310000, likeCount: 8700, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
        ]
      }
    ]
  },
  {
    grade: 10, board: 'CBSE', subject: 'Science',
    units: [
      {
        unitName: 'Chemistry',
        chapters: [
          { chapterName: 'Chemical Reactions and Equations', videos: [{ language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Chemical Reactions - Class 10', viewCount: 400000, likeCount: 11200, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] },
          { chapterName: 'Acids, Bases and Salts', videos: [{ language: 'English', youtubeVideoId: 'dQw4w9WgXcQ', title: 'Acids Bases Salts - Class 10', viewCount: 370000, likeCount: 10500, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Subject.deleteMany({});
    console.log('🗑️  Cleared existing data');

    await Subject.insertMany(SEED_DATA);
    console.log('🌱 Seeded ' + SEED_DATA.length + ' subject documents');

    console.log('\n📄 Example document (Class 8 CBSE Mathematics):');
    const example = await Subject.findOne({ grade: 8, board: 'CBSE', subject: 'Mathematics' });
    console.log(JSON.stringify(example.toJSON(), null, 2));

    await mongoose.disconnect();
    console.log('\n✅ Seed complete. Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
