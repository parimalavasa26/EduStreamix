require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix';

const CBSE_DATA = [
  {
    grade: 8,
    board: "CBSE",
    subject: "Mathematics",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Rational Numbers" },
          { lessonNo: "2", chapterName: "Powers and Exponents" },
          { lessonNo: "3", chapterName: "Squares and Square Roots" },
          { lessonNo: "4", chapterName: "Cubes and Cube Roots" },
          { lessonNo: "5", chapterName: "Algebraic Expressions" },
          { lessonNo: "6", chapterName: "Linear Equations in One Variable" },
          { lessonNo: "7", chapterName: "Understanding Quadrilaterals" },
          { lessonNo: "8", chapterName: "Practical Geometry" },
          { lessonNo: "9", chapterName: "Mensuration" },
          { lessonNo: "10", chapterName: "Data Handling" },
          { lessonNo: "11", chapterName: "Introduction to Graphs" },
          { lessonNo: "12", chapterName: "Comparing Quantities" },
          { lessonNo: "13", chapterName: "Direct and Inverse Proportions" },
          { lessonNo: "14", chapterName: "Visualising Patterns" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "CBSE",
    subject: "Science",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Force and Pressure" },
          { lessonNo: "2", chapterName: "Friction" },
          { lessonNo: "3", chapterName: "Sound" },
          { lessonNo: "4", chapterName: "Chemical Effects of Electric Current" },
          { lessonNo: "5", chapterName: "Synthetic Fibres and Plastics" },
          { lessonNo: "6", chapterName: "Metals and Non-Metals" },
          { lessonNo: "7", chapterName: "Coal and Petroleum" },
          { lessonNo: "8", chapterName: "Combustion and Flame" },
          { lessonNo: "9", chapterName: "Cell - Structure and Functions" },
          { lessonNo: "10", chapterName: "Reproduction in Animals" },
          { lessonNo: "11", chapterName: "Reaching the Age of Adolescence" },
          { lessonNo: "12", chapterName: "Microorganisms: Friend and Foe" },
          { lessonNo: "13", chapterName: "Pollution of Air and Water" },
          { lessonNo: "14", chapterName: "Some Natural Phenomena" },
          { lessonNo: "15", chapterName: "Light" },
          { lessonNo: "16", chapterName: "Stars and The Solar System" },
          { lessonNo: "17", chapterName: "Conservation of Plants and Animals" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "CBSE",
    subject: "Hindi",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "स्वदेश", videos: [{ language: "hindi", youtubeVideoId: "VIIDwz5m_V8", embedUrl: "https://www.youtube.com/embed/VIIDwz5m_V8" }] },
          { lessonNo: "2", chapterName: "दो गौरैया", videos: [{ language: "hindi", youtubeVideoId: "QnIek6m2OvE", embedUrl: "https://www.youtube.com/embed/QnIek6m2OvE" }] },
          { lessonNo: "3", chapterName: "मित्रलाभ", videos: [{ language: "hindi", youtubeVideoId: "9ngCtfJR6xI", embedUrl: "https://www.youtube.com/embed/9ngCtfJR6xI" }] },
          { lessonNo: "4", chapterName: "एक आशीर्वाद", videos: [{ language: "hindi", youtubeVideoId: "GOl5UOeVyio", embedUrl: "https://www.youtube.com/embed/GOl5UOeVyio" }] },
          { lessonNo: "5", chapterName: "हरिद्वार", videos: [{ language: "hindi", youtubeVideoId: "nR6sS2CqI40", embedUrl: "https://www.youtube.com/embed/nR6sS2CqI40" }] },
          { lessonNo: "6", chapterName: "कबीर के दोहे", videos: [{ language: "hindi", youtubeVideoId: "ekpc5E5pFAA", embedUrl: "https://www.youtube.com/embed/ekpc5E5pFAA" }] },
          { lessonNo: "7", chapterName: "कदम मिलाकर चलना होगा", videos: [{ language: "hindi", youtubeVideoId: "QgaeXSGjJd8", embedUrl: "https://www.youtube.com/embed/QgaeXSGjJd8" }] },
          { lessonNo: "8", chapterName: "एक टोकरी भर मिट्टी", videos: [{ language: "hindi", youtubeVideoId: "hWzITfJPdC8", embedUrl: "https://www.youtube.com/embed/hWzITfJPdC8" }] },
          { lessonNo: "9", chapterName: "मत बाँधो", videos: [{ language: "hindi", youtubeVideoId: "DirLvi-PxdM", embedUrl: "https://www.youtube.com/embed/DirLvi-PxdM" }] },
          { lessonNo: "10", chapterName: "नए मेहमान", videos: [{ language: "hindi", youtubeVideoId: "nN1Q_Ihw_Bo", embedUrl: "https://www.youtube.com/embed/nN1Q_Ihw_Bo" }] },
          { lessonNo: "11", chapterName: "आदमी के अनुपात", videos: [{ language: "hindi", youtubeVideoId: "4gRBas0p1Hw", embedUrl: "https://www.youtube.com/embed/4gRBas0p1Hw" }] },
          { lessonNo: "12", chapterName: "तरुण के स्वप्न", videos: [{ language: "hindi", youtubeVideoId: "VzcIxy9m46Y", embedUrl: "https://www.youtube.com/embed/VzcIxy9m46Y" }] },
          { lessonNo: "13", chapterName: "भारती जब विषय करो", videos: [{ language: "hindi", youtubeVideoId: "SaZrj3IIRqk", embedUrl: "https://www.youtube.com/embed/SaZrj3IIRqk" }] }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "CBSE",
    subject: "English",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "The Wit that Won Hearts", videos: [{ language: "english", youtubeVideoId: "aY2tXGalnAA", embedUrl: "https://www.youtube.com/embed/aY2tXGalnAA" }] },
          { lessonNo: "2", chapterName: "A Concrete Example", videos: [{ language: "english", youtubeVideoId: "tqNKxgPF13U", embedUrl: "https://www.youtube.com/embed/tqNKxgPF13U" }] },
          { lessonNo: "3", chapterName: "Wisdom Paves the Way", videos: [{ language: "english", youtubeVideoId: "Gdv5FXcVdPk", embedUrl: "https://www.youtube.com/embed/Gdv5FXcVdPk" }] },
          { lessonNo: "4", chapterName: "A Tale of Valour: Major Somnath Sharma and the Battle of Badgam", videos: [{ language: "english", youtubeVideoId: "CJL6tPrdeZA", embedUrl: "https://www.youtube.com/embed/CJL6tPrdeZA" }] },
          { lessonNo: "5", chapterName: "Somebody’s Mother", videos: [{ language: "english", youtubeVideoId: "T8J1lzv3Lx0", embedUrl: "https://www.youtube.com/embed/T8J1lzv3Lx0" }] },
          { lessonNo: "6", chapterName: "Verghese Kurien – I Too Had a Dream", videos: [{ language: "english", youtubeVideoId: "Y3LeKopfeGQ", embedUrl: "https://www.youtube.com/embed/Y3LeKopfeGQ" }] },
          { lessonNo: "7", chapterName: "The Case of the Fifth Word", videos: [{ language: "english", youtubeVideoId: "Cfn_f6dyHFE", embedUrl: "https://www.youtube.com/embed/Cfn_f6dyHFE" }] },
          { lessonNo: "8", chapterName: "The Magic Brush of Dreams", videos: [{ language: "english", youtubeVideoId: "FHC4EZYwIGk", embedUrl: "https://www.youtube.com/embed/FHC4EZYwIGk" }] },
          { lessonNo: "9", chapterName: "Spectacular Wonders", videos: [{ language: "english", youtubeVideoId: "3F7xQ5WQGUQ", embedUrl: "https://www.youtube.com/embed/3F7xQ5WQGUQ" }] },
          { lessonNo: "10", chapterName: "The Cherry Tree", videos: [{ language: "english", youtubeVideoId: "CGp9rsxowRE", embedUrl: "https://www.youtube.com/embed/CGp9rsxowRE" }] },
          { lessonNo: "11", chapterName: "Harvest Hymn", videos: [{ language: "english", youtubeVideoId: "4iaInTuRHXo", embedUrl: "https://www.youtube.com/embed/4iaInTuRHXo" }] },
          { lessonNo: "12", chapterName: "Waiting for the Rain", videos: [{ language: "english", youtubeVideoId: "aNnsRW_MjNc", embedUrl: "https://www.youtube.com/embed/aNnsRW_MjNc" }] },
          { lessonNo: "13", chapterName: "Feathered Friend", videos: [{ language: "english", youtubeVideoId: "eEZVXGfZvdg", embedUrl: "https://www.youtube.com/embed/eEZVXGfZvdg" }] },
          { lessonNo: "14", chapterName: "Magnifying Glass", videos: [{ language: "english", youtubeVideoId: "YGIZ-vV1OV0", embedUrl: "https://www.youtube.com/embed/YGIZ-vV1OV0" }] },
          { lessonNo: "15", chapterName: "Bibha Chowdhuri: The Beam of Light that Lit the Path for Women in Indian Science", videos: [{ language: "english", youtubeVideoId: "pZ-HLRtyCIM", embedUrl: "https://www.youtube.com/embed/pZ-HLRtyCIM" }] }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "CBSE",
    subject: "Social Science",
    units: [
      {
        unitName: "History",
        chapters: [
          { lessonNo: "1", chapterName: "How, When and Where", videos: [{ language: "english", youtubeVideoId: "DcNTEVNItAo", embedUrl: "https://www.youtube.com/embed/DcNTEVNItAo" }] },
          { lessonNo: "2", chapterName: "From Trade to Territory", videos: [{ language: "english", youtubeVideoId: "LL3Pkjg2kjM", embedUrl: "https://www.youtube.com/embed/LL3Pkjg2kjM" }] },
          { lessonNo: "3", chapterName: "Ruling the Countryside", videos: [{ language: "english", youtubeVideoId: "_SASgYGUcpY", embedUrl: "https://www.youtube.com/embed/_SASgYGUcpY" }] },
          { lessonNo: "4", chapterName: "Tribals, Dikus and the Vision of a Golden Age", videos: [{ language: "english", youtubeVideoId: "xiEEeJJPIKo", embedUrl: "https://www.youtube.com/embed/xiEEeJJPIKo" }] },
          { lessonNo: "5", chapterName: "When People Rebel (1857 and After)", videos: [{ language: "english", youtubeVideoId: "vsBdAjbs8bc", embedUrl: "https://www.youtube.com/embed/vsBdAjbs8bc" }] },
          { lessonNo: "6", chapterName: "Colonialism and the City", videos: [{ language: "english", youtubeVideoId: "tjLKKct8iHA", embedUrl: "https://www.youtube.com/embed/tjLKKct8iHA" }] },
          { lessonNo: "7", chapterName: "Weavers, Iron Smelters and Factory Owners", videos: [{ language: "english", youtubeVideoId: "k-EkcoKLKcE", embedUrl: "https://www.youtube.com/embed/k-EkcoKLKcE" }] },
          { lessonNo: "8", chapterName: "Civilising the “Native”, Educating the Nation", videos: [{ language: "english", youtubeVideoId: "Gggd-TZO1W8", embedUrl: "https://www.youtube.com/embed/Gggd-TZO1W8" }] },
          { lessonNo: "9", chapterName: "Women, Caste and Reform", videos: [{ language: "english", youtubeVideoId: "XJtZ3-H-jGM", embedUrl: "https://www.youtube.com/embed/XJtZ3-H-jGM" }] },
          { lessonNo: "10", chapterName: "The Changing World of Visual Arts", videos: [{ language: "english", youtubeVideoId: "rbF-NAUNOrg", embedUrl: "https://www.youtube.com/embed/rbF-NAUNOrg" }] },
          { lessonNo: "11", chapterName: "The Making of the National Movement (1870–1947)", videos: [{ language: "english", youtubeVideoId: "J3H5L6Vawec", embedUrl: "https://www.youtube.com/embed/J3H5L6Vawec" }] },
          { lessonNo: "12", chapterName: "India After Independence", videos: [{ language: "english", youtubeVideoId: "DkHLZPJcARA", embedUrl: "https://www.youtube.com/embed/DkHLZPJcARA" }] }
        ]
      },
      {
        unitName: "Geography",
        chapters: [
          { lessonNo: "1", chapterName: "Resources", videos: [{ language: "english", youtubeVideoId: "8i0UG-XUlFI", embedUrl: "https://www.youtube.com/embed/8i0UG-XUlFI" }] },
          { lessonNo: "2", chapterName: "Land, Soil, Water, Natural Vegetation and Wildlife Resources", videos: [{ language: "english", youtubeVideoId: "SNsLP1rbBHk", embedUrl: "https://www.youtube.com/embed/SNsLP1rbBHk" }] },
          { lessonNo: "3", chapterName: "Mineral and Power Resources", videos: [{ language: "english", youtubeVideoId: "1PT412oAPX4", embedUrl: "https://www.youtube.com/embed/1PT412oAPX4" }] },
          { lessonNo: "4", chapterName: "Agriculture", videos: [{ language: "english", youtubeVideoId: "f8pCwkRdk48", embedUrl: "https://www.youtube.com/embed/f8pCwkRdk48" }] },
          { lessonNo: "5", chapterName: "Industries", videos: [{ language: "english", youtubeVideoId: "Pi3FWHyqgqc", embedUrl: "https://www.youtube.com/embed/Pi3FWHyqgqc" }] },
          { lessonNo: "6", chapterName: "Human Resources", videos: [{ language: "english", youtubeVideoId: "Z23INTYZ4Pg", embedUrl: "https://www.youtube.com/embed/Z23INTYZ4Pg" }] }
        ]
      },
      {
        unitName: "Civics",
        chapters: [
          { lessonNo: "1", chapterName: "The Indian Constitution", videos: [{ language: "english", youtubeVideoId: "PAZDz1-WTgQ", embedUrl: "https://www.youtube.com/embed/PAZDz1-WTgQ" }] },
          { lessonNo: "2", chapterName: "Understanding Secularism", videos: [{ language: "english", youtubeVideoId: "kmxfbf9wxRE", embedUrl: "https://www.youtube.com/embed/kmxfbf9wxRE" }] },
          { lessonNo: "3", chapterName: "Why Do We Need a Parliament?", videos: [{ language: "english", youtubeVideoId: "X-Mt8mL96kU", embedUrl: "https://www.youtube.com/embed/X-Mt8mL96kU" }] },
          { lessonNo: "4", chapterName: "Understanding Laws", videos: [{ language: "english", youtubeVideoId: "trAKiKpJJNo", embedUrl: "https://www.youtube.com/embed/trAKiKpJJNo" }] },
          { lessonNo: "5", chapterName: "Judiciary", videos: [{ language: "english", youtubeVideoId: "tueiEGnmUTQ", embedUrl: "https://www.youtube.com/embed/tueiEGnmUTQ" }] },
          { lessonNo: "6", chapterName: "Understanding Our Criminal Justice System", videos: [{ language: "english", youtubeVideoId: "uv9Q0OrLTuA", embedUrl: "https://www.youtube.com/embed/uv9Q0OrLTuA" }] },
          { lessonNo: "7", chapterName: "Understanding Marginalisation", videos: [{ language: "english", youtubeVideoId: "ZeI041qla5Y", embedUrl: "https://www.youtube.com/embed/ZeI041qla5Y" }] },
          { lessonNo: "8", chapterName: "Confronting Marginalisation", videos: [{ language: "english", youtubeVideoId: "_6zTgG1aMC4", embedUrl: "https://www.youtube.com/embed/_6zTgG1aMC4" }] },
          { lessonNo: "9", chapterName: "Public Facilities", videos: [{ language: "english", youtubeVideoId: "spVPJDE4Qgc", embedUrl: "https://www.youtube.com/embed/spVPJDE4Qgc" }] },
          { lessonNo: "10", chapterName: "Law and Social Justice", videos: [{ language: "english", youtubeVideoId: "VHcTATnnVfA", embedUrl: "https://www.youtube.com/embed/VHcTATnnVfA" }] }
        ]
      },
      {
        unitName: "Economics",
        chapters: [
          { lessonNo: "1", chapterName: "The Story of Village Palampur", videos: [{ language: "english", youtubeVideoId: "tnXaHSg-PFU", embedUrl: "https://www.youtube.com/embed/tnXaHSg-PFU" }] },
          { lessonNo: "2", chapterName: "Role of the Government in Health", videos: [{ language: "english", youtubeVideoId: "PlfhC7VSPeg", embedUrl: "https://www.youtube.com/embed/PlfhC7VSPeg" }] },
          { lessonNo: "3", chapterName: "How the Markets Work", videos: [{ language: "english", youtubeVideoId: "k2T-bcobz_8", embedUrl: "https://www.youtube.com/embed/k2T-bcobz_8" }] },
          { lessonNo: "4", chapterName: "Globalisation and the Indian Economy", videos: [{ language: "english", youtubeVideoId: "PK2YonJyUeg", embedUrl: "https://www.youtube.com/embed/PK2YonJyUeg" }] },
          { lessonNo: "5", chapterName: "Public Distribution System", videos: [{ language: "english", youtubeVideoId: "EmsfXYIlA0c", embedUrl: "https://www.youtube.com/embed/EmsfXYIlA0c" }] }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB.');

    for (const subjectData of CBSE_DATA) {
        await Subject.findOneAndUpdate(
            { grade: subjectData.grade, board: subjectData.board, subject: subjectData.subject },
            subjectData,
            { upsert: true, new: true }
        );
        console.log(`Successfully seeded/updated ${subjectData.subject} for Grade ${subjectData.grade} ${subjectData.board}.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
