require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix';

const SSC_9_DATA = [
  {
    grade: 9,
    board: "SSC",
    subject: "Telugu",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "ధర్మార్జునులు" },
          { lessonNo: "2", chapterName: "నేనెరిగిన బాటలు" },
          { lessonNo: "3", chapterName: "వలస కూలి" },
          { lessonNo: "4", chapterName: "రంగాచార్యతో ముఖాముఖి" },
          { lessonNo: "5", chapterName: "శతక మధురిమ" },
          { lessonNo: "6", chapterName: "దీక్షకు సిద్ధంకండి" },
          { lessonNo: "7", chapterName: "చెలిమి" },
          { lessonNo: "8", chapterName: "ఉద్యమ స్ఫూర్తి" },
          { lessonNo: "9", chapterName: "కోర్స్" },
          { lessonNo: "10", chapterName: "వాగ్భూషణం" },
          { lessonNo: "11", chapterName: "వాయుసం" },
          { lessonNo: "12", chapterName: "తీయని పలకరింపు" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "SSC",
    subject: "Hindi",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "कबीर" },
          { lessonNo: "2", chapterName: "वह आवाज़" },
          { lessonNo: "3", chapterName: "बूँद" },
          { lessonNo: "4", chapterName: "तुम कब जाओगे, अतिथि!" },
          { lessonNo: "5", chapterName: "(उपवाचन: इस जल प्रलय में)" },
          { lessonNo: "6", chapterName: "ललद्यद" },
          { lessonNo: "7", chapterName: "दो बैलों की कथा" },
          { lessonNo: "8", chapterName: "कैदी और कोकिला" },
          { lessonNo: "9", chapterName: "नाना साहब की पुत्री" },
          { lessonNo: "10", chapterName: "(उपवाचन: रीढ़ की हड्डी)" },
          { lessonNo: "11", chapterName: "ग्रामश्री" },
          { lessonNo: "12", chapterName: "साँवले सपनों की याद" },
          { lessonNo: "13", chapterName: "एक कुत्ता और एक मैना" },
          { lessonNo: "14", chapterName: "उपभोक्तावाद की संस्कृति" },
          { lessonNo: "15", chapterName: "(उपवाचन: माटीवाली)" },
          { lessonNo: "16", chapterName: "खुशबू रचते हैं हाथ" },
          { lessonNo: "17", chapterName: "ल्हासा की ओर" },
          { lessonNo: "18", chapterName: "बच्चे काम पर जा रहे हैं" },
          { lessonNo: "19", chapterName: "मेरे बचपन के दिन" },
          { lessonNo: "20", chapterName: "(उपवाचन: अनोखा उपाय)" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "SSC",
    subject: "English",
    units: [
      {
        unitName: "Unit 1 – Humour",
        chapters: [
          { lessonNo: "1", chapterName: "The Snake and the Mirror" },
          { lessonNo: "2", chapterName: "The Duck and the Kangaroo (Poem)" },
          { lessonNo: "3", chapterName: "Little Bobby" }
        ]
      },
      {
        unitName: "Unit 2 – Games and Sports",
        chapters: [
          { lessonNo: "4", chapterName: "True Height" },
          { lessonNo: "5", chapterName: "What Is a Player? (Poem)" },
          { lessonNo: "6", chapterName: "V.V.S. Laxman, Very Very Special" }
        ]
      },
      {
        unitName: "Unit 3 – School Life",
        chapters: [
          { lessonNo: "7", chapterName: "Swami Is Expelled from School" },
          { lessonNo: "8", chapterName: "Not Just a Teacher, but a Friend (Poem)" },
          { lessonNo: "9", chapterName: "Homework" }
        ]
      },
      {
        unitName: "Unit 4 – Environment",
        chapters: [
          { lessonNo: "10", chapterName: "What Is Man Without the Beasts?" },
          { lessonNo: "11", chapterName: "The River (Poem)" },
          { lessonNo: "12", chapterName: "Can’t Climb Trees Any More" }
        ]
      },
      {
        unitName: "Unit 5 – Disasters",
        chapters: [
          { lessonNo: "13", chapterName: "A Havoc of Flood" },
          { lessonNo: "14", chapterName: "Grabbing Everything on the Land (Poem)" },
          { lessonNo: "15", chapterName: "The Ham Radio" }
        ]
      },
      {
        unitName: "Unit 6 – Freedom",
        chapters: [
          { lessonNo: "16", chapterName: "A Long Walk to Freedom" },
          { lessonNo: "17", chapterName: "Where the Mind Is Without Fear (Poem)" },
          { lessonNo: "18", chapterName: "An Icon of Civil Rights" }
        ]
      },
      {
        unitName: "Unit 7 – Theatre",
        chapters: [
          { lessonNo: "19", chapterName: "The Trial" },
          { lessonNo: "20", chapterName: "Antony’s Speech (Poem)" },
          { lessonNo: "21", chapterName: "Mahatma Gandhi, Pushed out of Train" }
        ]
      },
      {
        unitName: "Unit 8 – Travel and Tourism",
        chapters: [
          { lessonNo: "22", chapterName: "The Accidental Tourist" },
          { lessonNo: "23", chapterName: "Father Returning Home (Poem)" },
          { lessonNo: "24", chapterName: "Kathmandu" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "SSC",
    subject: "Mathematics",
    units: [
      {
        unitName: "Paper – I",
        chapters: [
          { lessonNo: "1", chapterName: "Real Numbers" },
          { lessonNo: "2", chapterName: "Polynomials and Factorisation" },
          { lessonNo: "3", chapterName: "Co-Ordinate Geometry" },
          { lessonNo: "4", chapterName: "Linear Equations in Two Variables" },
          { lessonNo: "5", chapterName: "Triangles" },
          { lessonNo: "6", chapterName: "Quadrilaterals" },
          { lessonNo: "7", chapterName: "Areas" }
        ]
      },
      {
        unitName: "Paper – II",
        chapters: [
          { lessonNo: "8", chapterName: "The Elements of Geometry" },
          { lessonNo: "9", chapterName: "Lines and Angles" },
          { lessonNo: "10", chapterName: "Statistics" },
          { lessonNo: "11", chapterName: "Surface Areas and Volumes" },
          { lessonNo: "12", chapterName: "Circles" },
          { lessonNo: "13", chapterName: "Geometrical Constructions" },
          { lessonNo: "14", chapterName: "Probability" },
          { lessonNo: "15", chapterName: "Proofs in Mathematics" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "SSC",
    subject: "Physics",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Matter Around Us" },
          { lessonNo: "2", chapterName: "Motion" },
          { lessonNo: "3", chapterName: "Laws of Motion" },
          { lessonNo: "4", chapterName: "Refraction of Light at Plane Surfaces" },
          { lessonNo: "5", chapterName: "Gravitation" },
          { lessonNo: "6", chapterName: "Is Matter Pure" },
          { lessonNo: "7", chapterName: "Atoms and Molecules and Chemical Reactions" },
          { lessonNo: "8", chapterName: "What is Inside Atom" },
          { lessonNo: "9", chapterName: "Work and Energy" },
          { lessonNo: "10", chapterName: "Heat" },
          { lessonNo: "11", chapterName: "Sound" },
          { lessonNo: "12", chapterName: "Revision" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "SSC",
    subject: "Biology",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Cell – Structure and Functions" },
          { lessonNo: "2", chapterName: "Plant Tissues" },
          { lessonNo: "3", chapterName: "Animal Tissues" },
          { lessonNo: "4", chapterName: "Transportation through Plasma Membrane" },
          { lessonNo: "5", chapterName: "Diversity in Living Organisms" },
          { lessonNo: "6", chapterName: "Sense Organs" },
          { lessonNo: "7", chapterName: "Animal Behaviour" },
          { lessonNo: "8", chapterName: "Challenges in Improving Agricultural Production" },
          { lessonNo: "9", chapterName: "Adaptations in Different Ecosystems" },
          { lessonNo: "10", chapterName: "Soil Pollution" },
          { lessonNo: "11", chapterName: "Biogeochemical Cycles" },
          { lessonNo: "12", chapterName: "Revision" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "SSC",
    subject: "Social Studies",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Our Earth" },
          { lessonNo: "2", chapterName: "The Natural Realms of the Earth" },
          { lessonNo: "3", chapterName: "Major Domains of the Earth" },
          { lessonNo: "4", chapterName: "Climate" },
          { lessonNo: "5", chapterName: "Natural Vegetation and Wildlife" },
          { lessonNo: "6", chapterName: "Population" },
          { lessonNo: "7", chapterName: "Settlements" },
          { lessonNo: "8", chapterName: "Resources" },
          { lessonNo: "9", chapterName: "Agriculture" },
          { lessonNo: "10", chapterName: "Industries" },
          { lessonNo: "11", chapterName: "Transport and Communication" },
          { lessonNo: "12", chapterName: "Democracy in the Contemporary World" },
          { lessonNo: "13", chapterName: "Electoral Politics" },
          { lessonNo: "14", chapterName: "Working of Institutions" },
          { lessonNo: "15", chapterName: "Democratic Rights" },
          { lessonNo: "16", chapterName: "Revision" }
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

    for (const subjectData of SSC_9_DATA) {
        await Subject.findOneAndUpdate(
            { grade: subjectData.grade, board: subjectData.board, subject: subjectData.subject },
            subjectData,
            { upsert: true, new: true }
        );
        console.log(`Successfully seeded/updated ${subjectData.subject} for Grade ${subjectData.grade} SSC.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
