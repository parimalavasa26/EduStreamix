require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix';

const ICSE_DATA = [
  {
    grade: 8,
    board: "ICSE",
    subject: "English",
    units: [
      {
        unitName: "Grammar & Composition",
        chapters: [
          { lessonNo: "1", chapterName: "Parts of Speech" },
          { lessonNo: "2", chapterName: "Comprehension Passage" },
          { lessonNo: "3", chapterName: "Tenses (Present Tense)" },
          { lessonNo: "4", chapterName: "Tenses (Past Tense)" },
          { lessonNo: "5", chapterName: "Tenses (Future Tense)" },
          { lessonNo: "6", chapterName: "Sentences (Part 1)" },
          { lessonNo: "7", chapterName: "Sentences (Part 2)" },
          { lessonNo: "8", chapterName: "Subject-Verb Agreement" },
          { lessonNo: "9", chapterName: "Composition and Paragraph Writing" },
          { lessonNo: "10", chapterName: "Preposition" },
          { lessonNo: "11", chapterName: "Letter Writing - Formal and Informal" },
          { lessonNo: "12", chapterName: "Determiners" },
          { lessonNo: "13", chapterName: "Conjunctions" },
          { lessonNo: "14", chapterName: "Active and Passive Voice (Part 1)" },
          { lessonNo: "15", chapterName: "Active and Passive Voice (Part 2)" },
          { lessonNo: "16", chapterName: "Notice and E-mail Writing / Diary Writing" },
          { lessonNo: "17", chapterName: "Adjectives and Adverbs" },
          { lessonNo: "18", chapterName: "Conjunctions" },
          { lessonNo: "19", chapterName: "Summary and Precise Writing / Figures of Speech / Story Writing" },
          { lessonNo: "20", chapterName: "Reported Speech (Part 1)" },
          { lessonNo: "21", chapterName: "Reported Speech (Part 2)" },
          { lessonNo: "22", chapterName: "Modals" },
          { lessonNo: "23", chapterName: "Transformation of Sentences (Part 1)" },
          { lessonNo: "24", chapterName: "Transformation of Sentences (Part 2)" },
          { lessonNo: "25", chapterName: "Phrases and Clauses" },
          { lessonNo: "26", chapterName: "Articles" },
          { lessonNo: "27", chapterName: "Homonyms / Homophones" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "ICSE",
    subject: "Mathematics",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Rational Numbers" },
          { lessonNo: "2", chapterName: "Exponents and Powers" },
          { lessonNo: "3", chapterName: "Squares and Square Roots" },
          { lessonNo: "4", chapterName: "Cubes and Cube Roots" },
          { lessonNo: "5", chapterName: "Playing with Numbers" },
          { lessonNo: "6", chapterName: "Sets" },
          { lessonNo: "7", chapterName: "Percent and Percentage" },
          { lessonNo: "8", chapterName: "Profit and Loss" },
          { lessonNo: "9", chapterName: "Simple and Compound Interest" },
          { lessonNo: "10", chapterName: "Direct and Inverse Variation" },
          { lessonNo: "11", chapterName: "Algebraic Expressions" },
          { lessonNo: "12", chapterName: "Algebra Identities" },
          { lessonNo: "13", chapterName: "Factorisation" },
          { lessonNo: "14", chapterName: "Linear Equations in One Variable" },
          { lessonNo: "15", chapterName: "Linear Inequations" },
          { lessonNo: "16", chapterName: "Quadrilaterals" },
          { lessonNo: "17", chapterName: "Special Types of Quadrilaterals" },
          { lessonNo: "18", chapterName: "Construction" },
          { lessonNo: "19", chapterName: "Representing 3-D in 2-D" },
          { lessonNo: "20", chapterName: "Symmetry – Reflection and Rotation" },
          { lessonNo: "21", chapterName: "Area of a Trapezium and Polygons" },
          { lessonNo: "22", chapterName: "Surface Area, Volume, and Capacity" },
          { lessonNo: "23", chapterName: "Data Handling" },
          { lessonNo: "24", chapterName: "Probability" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "ICSE",
    subject: "Biology",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Transport of Food and Minerals in Plants" },
          { lessonNo: "2", chapterName: "Reproduction in Plants" },
          { lessonNo: "3", chapterName: "Reproduction in Animals" },
          { lessonNo: "4", chapterName: "Ecosystem" },
          { lessonNo: "5", chapterName: "Endocrine System" },
          { lessonNo: "6", chapterName: "Adolescence" },
          { lessonNo: "7", chapterName: "Circulatory System" },
          { lessonNo: "8", chapterName: "Nervous System" },
          { lessonNo: "9", chapterName: "Diseases and First Aid" },
          { lessonNo: "10", chapterName: "Food Production and Management" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "ICSE",
    subject: "Chemistry",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Matter" },
          { lessonNo: "2", chapterName: "Physical and Chemical Changes" },
          { lessonNo: "3", chapterName: "Elements, Compounds and Mixtures" },
          { lessonNo: "4", chapterName: "Atomic Structure" },
          { lessonNo: "5", chapterName: "Language of Chemistry" },
          { lessonNo: "6", chapterName: "Chemical Reactions" },
          { lessonNo: "7", chapterName: "Carbon and its Compounds" },
          { lessonNo: "8", chapterName: "Water" },
          { lessonNo: "9", chapterName: "Hydrogen" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "ICSE",
    subject: "Physics",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Roadmap" },
          { lessonNo: "2", chapterName: "Matter – Kinetic Theory of Matter" },
          { lessonNo: "3", chapterName: "Physical Quantities and Measurements" },
          { lessonNo: "4", chapterName: "Force and Pressure" },
          { lessonNo: "5", chapterName: "Energy" },
          { lessonNo: "6", chapterName: "Light Energy" },
          { lessonNo: "7", chapterName: "Heat Transfer" },
          { lessonNo: "8", chapterName: "Sound" },
          { lessonNo: "9", chapterName: "Electricity" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "ICSE",
    subject: "Social Studies",
    units: [
      {
        unitName: "History, Civics & Geography",
        chapters: [
          { lessonNo: "1", chapterName: "Our Resources" },
          { lessonNo: "2", chapterName: "A Period of Transition" },
          { lessonNo: "3", chapterName: "The Constitution of India" },
          { lessonNo: "4", chapterName: "Land and Soil Resources" },
          { lessonNo: "5", chapterName: "The Growth of Nationalism: The Age of Revolutions" },
          { lessonNo: "6", chapterName: "Secularism and the Indian Constitution" },
          { lessonNo: "7", chapterName: "Water Resources" },
          { lessonNo: "8", chapterName: "Parliamentary Government and the Union Executive" },
          { lessonNo: "9", chapterName: "The American Civil War" },
          { lessonNo: "10", chapterName: "Natural Vegetation and Wildlife Resources" },
          { lessonNo: "11", chapterName: "Modern Period in Indian History – When, Where and How" },
          { lessonNo: "12", chapterName: "The Judiciary" },
          { lessonNo: "13", chapterName: "Mineral and Power Resources" },
          { lessonNo: "14", chapterName: "Understanding Laws" },
          { lessonNo: "15", chapterName: "Colonial Rule in India" },
          { lessonNo: "16", chapterName: "Types of Agriculture and Major Crops" },
          { lessonNo: "17", chapterName: "Role of Police and Courts" },
          { lessonNo: "18", chapterName: "Colonial Administration" },
          { lessonNo: "19", chapterName: "Rural Life and Society" },
          { lessonNo: "20", chapterName: "Major Crops and Agricultural Development" },
          { lessonNo: "21", chapterName: "Colonialism and Tribal Societies" },
          { lessonNo: "22", chapterName: "Understanding Marginalisation" },
          { lessonNo: "23", chapterName: "Weavers, Crafts and Industries" },
          { lessonNo: "24", chapterName: "Manufacturing Industries" },
          { lessonNo: "25", chapterName: "Revolt of 1857" },
          { lessonNo: "26", chapterName: "Social Justice and the Marginalised" },
          { lessonNo: "27", chapterName: "Education and British Rule" },
          { lessonNo: "28", chapterName: "Industries: Comparative Studies" },
          { lessonNo: "29", chapterName: "Socio-Religious Reforms" },
          { lessonNo: "30", chapterName: "Economic Presence of the Government" },
          { lessonNo: "31", chapterName: "Challenging the Caste System" },
          { lessonNo: "32", chapterName: "Human Resources" },
          { lessonNo: "33", chapterName: "Colonialism and Urban Changes" },
          { lessonNo: "34", chapterName: "The United Nations" },
          { lessonNo: "35", chapterName: "Changes in Art and Architecture" },
          { lessonNo: "36", chapterName: "Indian National Movement" },
          { lessonNo: "37", chapterName: "National Movement: Gandhian Era" },
          { lessonNo: "38", chapterName: "India After Independence" }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('Connected.');

    for (const subjectData of ICSE_DATA) {
      await Subject.findOneAndUpdate(
        { grade: subjectData.grade, board: subjectData.board, subject: subjectData.subject },
        subjectData,
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded ${subjectData.subject} for Grade ${subjectData.grade} ICSE`);
    }

    console.log('All ICSE updates complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
