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
          { lessonNo: "1", chapterName: "स्वदेश" },
          { lessonNo: "2", chapterName: "दो गौरैया" },
          { lessonNo: "3", chapterName: "मित्रलाभ" },
          { lessonNo: "4", chapterName: "एक आशीर्वाद" },
          { lessonNo: "5", chapterName: "हरिद्वार" },
          { lessonNo: "6", chapterName: "कबीर के दोहे" },
          { lessonNo: "7", chapterName: "कदम मिलाकर चलना होगा" },
          { lessonNo: "8", chapterName: "एक टोकरी भर मिट्टी" },
          { lessonNo: "9", chapterName: "मत बाँधो" },
          { lessonNo: "10", chapterName: "नए मेहमान" },
          { lessonNo: "11", chapterName: "आदमी के अनुपात" },
          { lessonNo: "12", chapterName: "तरुण के स्वप्न" },
          { lessonNo: "13", chapterName: "भारती जब विषय करो" }
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
          { lessonNo: "1", chapterName: "The Wit that Won Hearts" },
          { lessonNo: "2", chapterName: "A Concrete Example" },
          { lessonNo: "3", chapterName: "Wisdom Paves the Way" },
          { lessonNo: "4", chapterName: "A Tale of Valour: Major Somnath Sharma and the Battle of Badgam" },
          { lessonNo: "5", chapterName: "Somebody’s Mother" },
          { lessonNo: "6", chapterName: "Verghese Kurien – I Too Had a Dream" },
          { lessonNo: "7", chapterName: "The Case of the Fifth Word" },
          { lessonNo: "8", chapterName: "The Magic Brush of Dreams" },
          { lessonNo: "9", chapterName: "Spectacular Wonders" },
          { lessonNo: "10", chapterName: "The Cherry Tree" },
          { lessonNo: "11", chapterName: "Harvest Hymn" },
          { lessonNo: "12", chapterName: "Waiting for the Rain" },
          { lessonNo: "13", chapterName: "Feathered Friend" },
          { lessonNo: "14", chapterName: "Magnifying Glass" },
          { lessonNo: "15", chapterName: "Bibha Chowdhuri: The Beam of Light that Lit the Path for Women in Indian Science" }
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
          { lessonNo: "1", chapterName: "How, When and Where" },
          { lessonNo: "2", chapterName: "From Trade to Territory" },
          { lessonNo: "3", chapterName: "Ruling the Countryside" },
          { lessonNo: "4", chapterName: "Tribals, Dikus and the Vision of a Golden Age" },
          { lessonNo: "5", chapterName: "When People Rebel (1857 and After)" },
          { lessonNo: "6", chapterName: "Colonialism and the City" },
          { lessonNo: "7", chapterName: "Weavers, Iron Smelters and Factory Owners" },
          { lessonNo: "8", chapterName: "Civilising the “Native”, Educating the Nation" },
          { lessonNo: "9", chapterName: "Women, Caste and Reform" },
          { lessonNo: "10", chapterName: "The Changing World of Visual Arts" },
          { lessonNo: "11", chapterName: "The Making of the National Movement (1870–1947)" },
          { lessonNo: "12", chapterName: "India After Independence" }
        ]
      },
      {
        unitName: "Geography",
        chapters: [
          { lessonNo: "1", chapterName: "Resources" },
          { lessonNo: "2", chapterName: "Land, Soil, Water, Natural Vegetation and Wildlife Resources" },
          { lessonNo: "3", chapterName: "Mineral and Power Resources" },
          { lessonNo: "4", chapterName: "Agriculture" },
          { lessonNo: "5", chapterName: "Industries" },
          { lessonNo: "6", chapterName: "Human Resources" }
        ]
      },
      {
        unitName: "Civics",
        chapters: [
          { lessonNo: "1", chapterName: "The Indian Constitution" },
          { lessonNo: "2", chapterName: "Understanding Secularism" },
          { lessonNo: "3", chapterName: "Why Do We Need a Parliament?" },
          { lessonNo: "4", chapterName: "Understanding Laws" },
          { lessonNo: "5", chapterName: "Judiciary" },
          { lessonNo: "6", chapterName: "Understanding Our Criminal Justice System" },
          { lessonNo: "7", chapterName: "Understanding Marginalisation" },
          { lessonNo: "8", chapterName: "Confronting Marginalisation" },
          { lessonNo: "9", chapterName: "Public Facilities" },
          { lessonNo: "10", chapterName: "Law and Social Justice" }
        ]
      },
      {
        unitName: "Economics",
        chapters: [
          { lessonNo: "1", chapterName: "The Story of Village Palampur" },
          { lessonNo: "2", chapterName: "Role of the Government in Health" },
          { lessonNo: "3", chapterName: "How the Markets Work" },
          { lessonNo: "4", chapterName: "Globalisation and the Indian Economy" },
          { lessonNo: "5", chapterName: "Public Distribution System" }
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
