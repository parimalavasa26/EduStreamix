require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix';

const CBSE_9_DATA = [
  {
    grade: 9,
    board: "CBSE",
    subject: "Mathematics",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Number Systems" },
          { lessonNo: "2", chapterName: "Polynomials" },
          { lessonNo: "3", chapterName: "Coordinate Geometry" },
          { lessonNo: "4", chapterName: "Linear Equations in Two Variables" },
          { lessonNo: "5", chapterName: "Introduction to Euclid’s Geometry" },
          { lessonNo: "6", chapterName: "Lines and Angles" },
          { lessonNo: "7", chapterName: "Triangles" },
          { lessonNo: "8", chapterName: "Quadrilaterals" },
          { lessonNo: "9", chapterName: "Areas of Parallelograms and Triangles" },
          { lessonNo: "10", chapterName: "Circles" },
          { lessonNo: "11", chapterName: "Constructions" },
          { lessonNo: "12", chapterName: "Heron’s Formula" },
          { lessonNo: "13", chapterName: "Surface Areas and Volumes" },
          { lessonNo: "14", chapterName: "Statistics" },
          { lessonNo: "15", chapterName: "Probability" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "CBSE",
    subject: "Science",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Matter in Our Surroundings" },
          { lessonNo: "2", chapterName: "Is Matter Around Us Pure?" },
          { lessonNo: "3", chapterName: "Atoms and Molecules" },
          { lessonNo: "4", chapterName: "Structure of the Atom" },
          { lessonNo: "5", chapterName: "The Fundamental Unit of Life" },
          { lessonNo: "6", chapterName: "Tissues" },
          { lessonNo: "7", chapterName: "Motion" },
          { lessonNo: "8", chapterName: "Force and Laws of Motion" },
          { lessonNo: "9", chapterName: "Gravitation" },
          { lessonNo: "10", chapterName: "Work and Energy" },
          { lessonNo: "11", chapterName: "Sound" },
          { lessonNo: "12", chapterName: "Improvement in Food Resources" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "CBSE",
    subject: "English",
    units: [
      {
        unitName: "Beehive / Moments",
        chapters: [
          { lessonNo: "1", chapterName: "The Lost Child" },
          { lessonNo: "2", chapterName: "The Adventures of Toto" },
          { lessonNo: "3", chapterName: "Iswaran the Storyteller" },
          { lessonNo: "4", chapterName: "In the Kingdom of Fools" },
          { lessonNo: "5", chapterName: "The Happy Prince" },
          { lessonNo: "6", chapterName: "Weathering the Storm in Ersama" },
          { lessonNo: "7", chapterName: "The Last Leaf" },
          { lessonNo: "8", chapterName: "A House Is Not a Home" },
          { lessonNo: "9", chapterName: "The Accidental Tourist" },
          { lessonNo: "10", chapterName: "The Beggar" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "CBSE",
    subject: "Social Science",
    units: [
      {
        unitName: "History",
        chapters: [
          { lessonNo: "1", chapterName: "The French Revolution" },
          { lessonNo: "2", chapterName: "Socialism in Europe and the Russian Revolution" },
          { lessonNo: "3", chapterName: "Nazism and the Rise of Hitler" },
          { lessonNo: "4", chapterName: "Forest Society and Colonialism" },
          { lessonNo: "5", chapterName: "Pastoralists in the Modern World" }
        ]
      },
      {
        unitName: "Geography",
        chapters: [
          { lessonNo: "6", chapterName: "India – Size and Location" },
          { lessonNo: "7", chapterName: "Physical Features of India" },
          { lessonNo: "8", chapterName: "Drainage" },
          { lessonNo: "9", chapterName: "Climate" },
          { lessonNo: "10", chapterName: "Natural Vegetation and Wildlife" },
          { lessonNo: "11", chapterName: "Population" }
        ]
      },
      {
        unitName: "Civics",
        chapters: [
          { lessonNo: "12", chapterName: "What is Democracy? Why Democracy?" },
          { lessonNo: "13", chapterName: "Constitutional Design" },
          { lessonNo: "14", chapterName: "Electoral Politics" },
          { lessonNo: "15", chapterName: "Working of Institutions" },
          { lessonNo: "16", chapterName: "Democratic Rights" }
        ]
      },
      {
        unitName: "Economics",
        chapters: [
          { lessonNo: "17", chapterName: "The Story of Village Palampur" },
          { lessonNo: "18", chapterName: "People as Resource" },
          { lessonNo: "19", chapterName: "Poverty as a Challenge" },
          { lessonNo: "20", chapterName: "Food Security in India" }
        ]
      }
    ]
  },
  {
    grade: 9,
    board: "CBSE",
    subject: "Hindi",
    units: [
      {
        unitName: "क्षितिज भाग-1",
        chapters: [
          { lessonNo: "1", chapterName: "सूरदास: पद" },
          { lessonNo: "2", chapterName: "तुलसीदास: राम लक्ष्मण परशुराम संवाद" },
          { lessonNo: "3", chapterName: "जयशंकर प्रसाद: आत्मकथ्य" },
          { lessonNo: "4", chapterName: "सूर्यकांत त्रिपाठी ‘निराला’: उत्साह एवं अट नहीं रही है" },
          { lessonNo: "5", chapterName: "नागार्जुन: यह दंतुरित मुस्कान एवं फसल" },
          { lessonNo: "6", chapterName: "मंगलेश डबराल: संगतकार" },
          { lessonNo: "7", chapterName: "स्वयं प्रकाश: नेताजी का चश्मा" },
          { lessonNo: "8", chapterName: "रामवृక్ష बेनीपुरी: बालगोबिन भगत" },
          { lessonNo: "9", chapterName: "यशपाल: लखनवी अंदाज़" },
          { lessonNo: "10", chapterName: "मनु भंडारी: एक कहानी यह भी" },
          { lessonNo: "11", chapterName: "रवींद्र मिश्र: नौबतखाने में इबादत" },
          { lessonNo: "12", chapterName: "भदंत आनंद कौसल्यायन: संस्कृति" }
        ]
      },
      {
        unitName: "कृतिका भाग-1",
        chapters: [
          { lessonNo: "13", chapterName: "शिवपूजन सहाय: माता का अंचल" },
          { lessonNo: "14", chapterName: "मधु कांकरिया: साना-साना हाथ जोड़ि" },
          { lessonNo: "15", chapterName: "अज्ञेय: ‘मैं क्यों लिखता हूँ’" }
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

    for (const subjectData of CBSE_9_DATA) {
        // Inject dummy metadata to avoid empty fields if needed
        subjectData.units.forEach(unit => {
          unit.chapters.forEach(chapter => {
            chapter.summary = `Detailed study material for ${chapter.chapterName}.`;
            chapter.quizQuestions = [
              {
                question: `What is the main topic of ${chapter.chapterName}?`,
                options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                correctAnswer: 0
              }
            ];
          });
        });

        await Subject.findOneAndUpdate(
            { grade: subjectData.grade, board: subjectData.board, subject: subjectData.subject },
            subjectData,
            { upsert: true, new: true }
        );
        console.log(`Successfully seeded/updated ${subjectData.subject} for Grade ${subjectData.grade} CBSE.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
