require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix';

const SSC_DATA = [
  {
    grade: 8,
    board: "SSC",
    subject: "Telugu",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "త్యాగనిరతి" },
          { lessonNo: "2", chapterName: "సముద్ర ప్రయాణం" },
          { lessonNo: "3", chapterName: "బండారి బసవన్న" },
          { lessonNo: "4", chapterName: "అసామాన్యులు" },
          { lessonNo: "5", chapterName: "శతకసుధ" },
          { lessonNo: "6", chapterName: "తెలుగు జానపద గేయాలు" },
          { lessonNo: "7", chapterName: "మంజీరా" },
          { lessonNo: "8", chapterName: "చిన్నప్పుడే" },
          { lessonNo: "9", chapterName: "అమరులు" },
          { lessonNo: "10", chapterName: "సింగరేణి" },
          { lessonNo: "11", chapterName: "కాపుబిడ్డ" },
          { lessonNo: "12", chapterName: "మాట్లాడే నాగలి" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "SSC",
    subject: "Hindi",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "बरसते बादल" },
          { lessonNo: "2", chapterName: "लाख की चूड़ियाँ" },
          { lessonNo: "3", chapterName: "बस की यात्रा" },
          { lessonNo: "4", chapterName: "दीवानों की हस्ती" },
          { lessonNo: "5", chapterName: "खेल जहाँ, मैदान वहाँ" },
          { lessonNo: "6", chapterName: "चिड़ियों की अनूठी दुनिया" },
          { lessonNo: "7", chapterName: "अरमान" },
          { lessonNo: "8", chapterName: "कामचोर" },
          { lessonNo: "9", chapterName: "क्या निराश हुआ जाए" },
          { lessonNo: "10", chapterName: "शुक्रिया निकुम्भ सर" },
          { lessonNo: "11", chapterName: "कबीर की साखियाँ" },
          { lessonNo: "12", chapterName: "जब सिनेमा ने बोलना सीखा" },
          { lessonNo: "13", chapterName: "दो कलाकार" },
          { lessonNo: "14", chapterName: "सुदामा चरित" },
          { lessonNo: "15", chapterName: "जहाँ पहिया है" },
          { lessonNo: "16", chapterName: "पानी की कहानी" },
          { lessonNo: "17", chapterName: "हमारा संकल्प" },
          { lessonNo: "18", chapterName: "सूरदास के पद" },
          { lessonNo: "19", chapterName: "बाज़ और साँप" },
          { lessonNo: "20", chapterName: "पहाड़ से ऊँचा आदमी" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "SSC",
    subject: "English",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "The Tattered Blanket" },
          { lessonNo: "2", chapterName: "My Mother (Poem)" },
          { lessonNo: "3", chapterName: "Letter to a Friend" },
          { lessonNo: "4", chapterName: "Oliver Asks for More" },
          { lessonNo: "5", chapterName: "The Cry of Children (Poem)" },
          { lessonNo: "6", chapterName: "Reaching the Unreached" },
          { lessonNo: "7", chapterName: "The Selfish Giant (Part I)" },
          { lessonNo: "8", chapterName: "The Selfish Giant (Part II)" },
          { lessonNo: "9", chapterName: "The Garden Within (Poem)" },
          { lessonNo: "10", chapterName: "The Fun They Had" },
          { lessonNo: "11", chapterName: "Preteen Pretext (Poem)" },
          { lessonNo: "12", chapterName: "The Computer Game" },
          { lessonNo: "13", chapterName: "The Treasure Within – Part I" },
          { lessonNo: "14", chapterName: "The Treasure Within – Part II" },
          { lessonNo: "15", chapterName: "They Literally Build the Nation" },
          { lessonNo: "16", chapterName: "The Story of Ikat" },
          { lessonNo: "17", chapterName: "The Earthen Goblet (Poem)" },
          { lessonNo: "18", chapterName: "Maestro with a Mission" },
          { lessonNo: "19", chapterName: "Bonsai Life – Part I" },
          { lessonNo: "20", chapterName: "Bonsai Life – Part II" },
          { lessonNo: "21", chapterName: "I Can Take Care of Myself" },
          { lessonNo: "22", chapterName: "Dr. Dwarakanath Kotnis" },
          { lessonNo: "23", chapterName: "Be Thankful (Poem)" },
          { lessonNo: "24", chapterName: "The Dead Rat" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "SSC",
    subject: "Mathematics",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Rational Numbers" },
          { lessonNo: "2", chapterName: "Linear Equations in One Variable" },
          { lessonNo: "3", chapterName: "Construction of Quadrilaterals" },
          { lessonNo: "4", chapterName: "Exponents and Powers" },
          { lessonNo: "5", chapterName: "Comparing Quantities" },
          { lessonNo: "6", chapterName: "Square Roots and Cube Roots" },
          { lessonNo: "7", chapterName: "Frequency Distribution Tables and Graphs" },
          { lessonNo: "8", chapterName: "Exploring Geometrical Figures" },
          { lessonNo: "9", chapterName: "Area of Plane Figures" },
          { lessonNo: "10", chapterName: "Direct and Inverse Proportions" },
          { lessonNo: "11", chapterName: "Algebraic Expressions" },
          { lessonNo: "12", chapterName: "Factorisation" },
          { lessonNo: "13", chapterName: "Visualizing 3-D in 2-D" },
          { lessonNo: "14", chapterName: "Surface Areas and Volumes" },
          { lessonNo: "15", chapterName: "Playing with Numbers" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "SSC",
    subject: "Physics",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Force" },
          { lessonNo: "2", chapterName: "Friction" },
          { lessonNo: "3", chapterName: "Synthetic Fibres and Plastics" },
          { lessonNo: "4", chapterName: "Metals and Non metals" },
          { lessonNo: "5", chapterName: "Sound" },
          { lessonNo: "6", chapterName: "Reflection of Light at plane surfaces" },
          { lessonNo: "7", chapterName: "Coal and Petroleum" },
          { lessonNo: "8", chapterName: "Combustion, Fuels and flame" },
          { lessonNo: "9", chapterName: "Electrical Conductivity of Liquids" },
          { lessonNo: "10", chapterName: "Some natural phenomena" },
          { lessonNo: "11", chapterName: "Stars and the Solar system" },
          { lessonNo: "12", chapterName: "Graphs of Motion" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "SSC",
    subject: "Biology",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "What is Science ?" },
          { lessonNo: "2", chapterName: "Cell - The Basic Unit of Life" },
          { lessonNo: "3", chapterName: "Microbial World -1" },
          { lessonNo: "4", chapterName: "Microbial World - 2" },
          { lessonNo: "5", chapterName: "Reproduction in Animals" },
          { lessonNo: "6", chapterName: "Adolescence" },
          { lessonNo: "7", chapterName: "Biodiversity and its Conservation" },
          { lessonNo: "8", chapterName: "Different Ecosystems" },
          { lessonNo: "9", chapterName: "Food Production from plants" },
          { lessonNo: "10", chapterName: "Food Production from animals" },
          { lessonNo: "11", chapterName: "Not for Drinking - Not for Breathing" },
          { lessonNo: "12", chapterName: "Why do we fall ill ?" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "SSC",
    subject: "Social Studies",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Reading and Analysis of Maps" },
          { lessonNo: "2", chapterName: "Energy from the Sun" },
          { lessonNo: "3", chapterName: "Earth Movements and Seasons" },
          { lessonNo: "4", chapterName: "The Polar Regions" },
          { lessonNo: "5", chapterName: "Forests : Using and Protecting Them" },
          { lessonNo: "6", chapterName: "Minerals and Mining" },
          { lessonNo: "7", chapterName: "Money and Banking" },
          { lessonNo: "8", chapterName: "Impact of Technology on Livelihoods" },
          { lessonNo: "9", chapterName: "Public Health and the Government" },
          { lessonNo: "10", chapterName: "Landlords and Tenants under the British and the Nizam" },
          { lessonNo: "11", chapterName: "National Movement – The Early Phase – 1885-1919" },
          { lessonNo: "12", chapterName: "National Movement – The Last Phase 1919-1947" },
          { lessonNo: "13", chapterName: "Freedom Movement in Hyderabad State" },
          { lessonNo: "14", chapterName: "The Indian Constitution" },
          { lessonNo: "15", chapterName: "Parliament and Central Government" },
          { lessonNo: "16", chapterName: "Law and Justice – A Case Study" },
          { lessonNo: "17", chapterName: "Abolition of Zamindari System" },
          { lessonNo: "18", chapterName: "Understanding Poverty" },
          { lessonNo: "19", chapterName: "Rights Approach to Development" },
          { lessonNo: "20", chapterName: "Social and Religious Reform Movements" },
          { lessonNo: "21", chapterName: "Understanding Secularism" },
          { lessonNo: "22", chapterName: "Performing Arts and Artistes in Modern Times" },
          { lessonNo: "23", chapterName: "Film and Print Media" },
          { lessonNo: "24", chapterName: "Sports : Nationalism and Commerce" },
          { lessonNo: "25", chapterName: "Disaster management" }
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

    for (const subjectData of SSC_DATA) {
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
