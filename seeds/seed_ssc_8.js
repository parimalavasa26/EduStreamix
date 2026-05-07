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
          { lessonNo: "1", chapterName: "త్యాగనిరతి", type: "Language" },
          { lessonNo: "2", chapterName: "సముద్ర ప్రయాణం", type: "Language" },
          { lessonNo: "3", chapterName: "బండారి బసవన్న", type: "Language" },
          { lessonNo: "4", chapterName: "అసామాన్యులు", type: "Language" },
          { lessonNo: "5", chapterName: "శతకసుధ", type: "Language" },
          { lessonNo: "6", chapterName: "తెలుగు జానపద గేయాలు", type: "Language" },
          { lessonNo: "7", chapterName: "మంజీరా", type: "Language" },
          { lessonNo: "8", chapterName: "చిన్నప్పుడే", type: "Language" },
          { lessonNo: "9", chapterName: "అమరులు", type: "Language" },
          { lessonNo: "10", chapterName: "సింగరేణి", type: "Language" },
          { lessonNo: "11", chapterName: "కాపుబిడ్డ", type: "Language" },
          { lessonNo: "12", chapterName: "మాట్లాడే నాగలి", type: "Language" }
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
          { lessonNo: "1", chapterName: "बरसते बादल", type: "Language" },
          { lessonNo: "2", chapterName: "लाख की चूड़ियाँ", type: "Language" },
          { lessonNo: "3", chapterName: "बस की यात्रा", type: "Language" },
          { lessonNo: "4", chapterName: "दीवानों की हस्ती", type: "Language" },
          { lessonNo: "5", chapterName: "खेल जहाँ, मैदान वहाँ", type: "Language" },
          { lessonNo: "6", chapterName: "चिड़ियों की अनूठी दुनिया", type: "Language" },
          { lessonNo: "7", chapterName: "अरमान", type: "Language" },
          { lessonNo: "8", chapterName: "कामचोर", type: "Language" },
          { lessonNo: "9", chapterName: "क्या निराश हुआ जाए", type: "Language" },
          { lessonNo: "10", chapterName: "शुक्रिया निकुम्भ सर", type: "Language" },
          { lessonNo: "11", chapterName: "कबीर की साखियाँ", type: "Language" },
          { lessonNo: "12", chapterName: "जब सिनेमा ने बोलना सीखा", type: "Language" },
          { lessonNo: "13", chapterName: "दो कलाकार", type: "Language" },
          { lessonNo: "14", chapterName: "सुदामा चरित", type: "Language" },
          { lessonNo: "15", chapterName: "जहाँ पहिया है", type: "Language" },
          { lessonNo: "16", chapterName: "पानी की कहानी", type: "Language" },
          { lessonNo: "17", chapterName: "हमारा संकल्प", type: "Language" },
          { lessonNo: "18", chapterName: "सूरदास के पद", type: "Language" },
          { lessonNo: "19", chapterName: "बाज़ और साँप", type: "Language" },
          { lessonNo: "20", chapterName: "पहाड़ से ऊँचा आदमी", type: "Language" }
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
        unitName: "Unit-1 Family",
        chapters: [
          { lessonNo: "1A", chapterName: "The Tattered Blanket", type: "Reading A" },
          { lessonNo: "1B", chapterName: "My Mother (Poem)", type: "Reading B" },
          { lessonNo: "1C", chapterName: "Letter to a Friend", type: "Reading C" }
        ]
      },
      {
        unitName: "Unit-2 Social Issues",
        chapters: [
          { lessonNo: "2A", chapterName: "Oliver Asks for More", type: "Reading A" },
          { lessonNo: "2B", chapterName: "The Cry of Children (Poem)", type: "Reading B" },
          { lessonNo: "2C", chapterName: "Reaching the Unreached", type: "Reading C" }
        ]
      },
      {
        unitName: "Unit-3 Humanity",
        chapters: [
          { lessonNo: "3A", chapterName: "The Selfish Giant (Part I)", type: "Reading A" },
          { lessonNo: "3B", chapterName: "The Selfish Giant (Part II)", type: "Reading B" },
          { lessonNo: "3C", chapterName: "The Garden Within (Poem)", type: "Reading C" }
        ]
      },
      {
        unitName: "Unit-4 Science and Technology",
        chapters: [
          { lessonNo: "4A", chapterName: "The Fun They Had", type: "Reading A" },
          { lessonNo: "4B", chapterName: "Preteen Pretext (Poem)", type: "Reading B" },
          { lessonNo: "4C", chapterName: "The Computer Game", type: "Reading C" }
        ]
      },
      {
        unitName: "Unit-5 Educational and Career",
        chapters: [
          { lessonNo: "5A", chapterName: "The Treasure Within – Part I", type: "Reading A" },
          { lessonNo: "5B", chapterName: "The Treasure Within – Part II", type: "Reading B" },
          { lessonNo: "5C", chapterName: "They Literally Build the Nation", type: "Reading C" }
        ]
      },
      {
        unitName: "Unit-6 Art and Culture",
        chapters: [
          { lessonNo: "6A", chapterName: "The Story of Ikat", type: "Reading A" },
          { lessonNo: "6B", chapterName: "The Earthen Goblet (Poem)", type: "Reading B" },
          { lessonNo: "6C", chapterName: "Maestro with a Mission", type: "Reading C" }
        ]
      },
      {
        unitName: "Unit-7 Women Empowerment",
        chapters: [
          { lessonNo: "7A", chapterName: "Bonsai Life – Part I", type: "Reading A" },
          { lessonNo: "7B", chapterName: "Bonsai Life – Part II", type: "Reading B" },
          { lessonNo: "7C", chapterName: "I Can Take Care of Myself", type: "Reading C" }
        ]
      },
      {
        unitName: "Unit-8 Gratitude",
        chapters: [
          { lessonNo: "8A", chapterName: "Dr. Dwarakanath Kotnis", type: "Reading A" },
          { lessonNo: "8B", chapterName: "Be Thankful (Poem)", type: "Reading B" },
          { lessonNo: "8C", chapterName: "The Dead Rat", type: "Reading C" }
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
          { lessonNo: "1", chapterName: "Rational Numbers", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "GJnvCdnrgqQ", title: "Rational Numbers" }] },
          { lessonNo: "2", chapterName: "Linear Equations in One Variable", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "_YkILElUy78", title: "Linear Equations in One Variable" }] },
          { lessonNo: "3", chapterName: "Construction of Quadrilaterals", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "KJSAgTenbHk", title: "Construction of Quadrilaterals" }] },
          { lessonNo: "4", chapterName: "Exponents and Powers", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "kxo6TfPUXA0", title: "Exponents and Powers" }] },
          { lessonNo: "5", chapterName: "Comparing Quantities", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "C_pVYSHv0mk", title: "Comparing Quantities" }] },
          { lessonNo: "6", chapterName: "Square Roots and Cube Roots", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "UeXx3H-rxFg", title: "Square Roots and Cube Roots" }] },
          { lessonNo: "7", chapterName: "Frequency Distribution Tables and Graphs", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "PhbwrW6cg-k", title: "Frequency Distribution Tables and Graphs" }] },
          { lessonNo: "8", chapterName: "Exploring Geometrical Figures", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "3qYtJJQoIQc", title: "Exploring Geometrical Figures" }] },
          { lessonNo: "9", chapterName: "Area of Plane Figures", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "acZ31AQSYZY", title: "Area of Plane Figures" }] },
          { lessonNo: "10", chapterName: "Direct and Inverse Proportions", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "wqbOcpbZeDI", title: "Direct and Inverse Proportions" }] },
          { lessonNo: "11", chapterName: "Algebraic Expressions", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "c0NgtjfTJBo", title: "Algebraic Expressions" }] },
          { lessonNo: "12", chapterName: "Factorisation", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "1LibHHbAL28", title: "Factorisation" }] },
          { lessonNo: "13", chapterName: "Visualizing 3-D in 2-D", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "QZ8oez8eUfA", title: "Visualizing 3-D in 2-D" }] },
          { lessonNo: "14", chapterName: "Surface Areas and Volumes", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "2rp_-h6PnFo", title: "Surface Areas and Volumes" }] },
          { lessonNo: "15", chapterName: "Playing with Numbers", type: "Mathematics", videos: [{ language: "English", youtubeVideoId: "TgLC7rnGCCQ", title: "Playing with Numbers" }] }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "SSC",
    subject: "Physical Science",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "Force", type: "Physics" },
          { lessonNo: "2", chapterName: "Friction", type: "Physics" },
          { lessonNo: "3", chapterName: "Synthetic Fibres and Plastics", type: "Chemistry" },
          { lessonNo: "4", chapterName: "Metals and Non metals", type: "Chemistry" },
          { lessonNo: "5", chapterName: "Sound", type: "Physics" },
          { lessonNo: "6", chapterName: "Reflection of Light at plane surfaces", type: "Physics" },
          { lessonNo: "7", chapterName: "Coal and Petroleum", type: "Chemistry" },
          { lessonNo: "8", chapterName: "Combustion, Fuels and flame", type: "Chemistry" },
          { lessonNo: "9", chapterName: "Electrical Conductivity of Liquids", type: "Physics" },
          { lessonNo: "10", chapterName: "Some natural phenomena", type: "Physics" },
          { lessonNo: "11", chapterName: "Stars and the Solar system", type: "Physics" },
          { lessonNo: "12", chapterName: "Graphs of Motion", type: "Physics" }
        ]
      }
    ]
  },
  {
    grade: 8,
    board: "SSC",
    subject: "Biological Science",
    units: [
      {
        unitName: "General",
        chapters: [
          { lessonNo: "1", chapterName: "What is Science ?", type: "Biology" },
          { lessonNo: "2", chapterName: "Cell - The Basic Unit of Life", type: "Biology" },
          { lessonNo: "3", chapterName: "Microbial World -1", type: "Biology" },
          { lessonNo: "4", chapterName: "Microbial World - 2", type: "Biology" },
          { lessonNo: "5", chapterName: "Reproduction in Animals", type: "Biology" },
          { lessonNo: "6", chapterName: "Adolescence", type: "Biology" },
          { lessonNo: "7", chapterName: "Biodiversity and its Conservation", type: "Biology" },
          { lessonNo: "8", chapterName: "Different Ecosystems", type: "Biology" },
          { lessonNo: "9", chapterName: "Food Production from plants", type: "Biology" },
          { lessonNo: "10", chapterName: "Food Production from animals", type: "Biology" },
          { lessonNo: "11", chapterName: "Not for Drinking - Not for Breathing", type: "Biology" },
          { lessonNo: "12", chapterName: "Why do we fall ill ?", type: "Biology" }
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
        unitName: "Theme I : Diversity on the Earth",
        chapters: [
          { lessonNo: "1", chapterName: "Reading and Analysis of Maps", type: "Geography" },
          { lessonNo: "2", chapterName: "Energy from the Sun", type: "Geography" },
          { lessonNo: "3", chapterName: "Earth Movements and Seasons", type: "Geography" },
          { lessonNo: "4", chapterName: "The Polar Regions", type: "Geography" },
          { lessonNo: "5", chapterName: "Forests : Using and Protecting Them", type: "Geography" },
          { lessonNo: "6", chapterName: "Minerals and Mining", type: "Geography" }
        ]
      },
      {
        unitName: "Theme II: Production, Exchange and Livelihoods",
        chapters: [
          { lessonNo: "7", chapterName: "Money and Banking", type: "Economics" },
          { lessonNo: "8", chapterName: "Impact of Technology on Livelihoods", type: "Economics" },
          { lessonNo: "9", chapterName: "Public Health and the Government", type: "Civics" }
        ]
      },
      {
        unitName: "Theme III: Political Systems and Governance",
        chapters: [
          { lessonNo: "10", chapterName: "Landlords and Tenants under the British and the Nizam", type: "History" },
          { lessonNo: "11A", chapterName: "National Movement – The Early Phase – 1885-1919", type: "History" },
          { lessonNo: "11B", chapterName: "National Movement – The Last Phase 1919-1947", type: "History" },
          { lessonNo: "12", chapterName: "Freedom Movement in Hyderabad State", type: "History" },
          { lessonNo: "13", chapterName: "The Indian Constitution", type: "Civics" },
          { lessonNo: "14", chapterName: "Parliament and Central Government", type: "Civics" },
          { lessonNo: "15", chapterName: "Law and Justice – A Case Study", type: "Civics" }
        ]
      },
      {
        unitName: "Theme IV: Social Organization and Inequities",
        chapters: [
          { lessonNo: "16", chapterName: "Abolition of Zamindari System", type: "History" },
          { lessonNo: "17", chapterName: "Understanding Poverty", type: "Economics" },
          { lessonNo: "18", chapterName: "Rights Approach to Development", type: "Civics" }
        ]
      },
      {
        unitName: "Theme V: Religion and Society",
        chapters: [
          { lessonNo: "19", chapterName: "Social and Religious Reform Movements", type: "History" },
          { lessonNo: "20", chapterName: "Understanding Secularism", type: "Civics" }
        ]
      },
      {
        unitName: "Theme VI: Culture and Communication",
        chapters: [
          { lessonNo: "21", chapterName: "Performing Arts and Artistes in Modern Times", type: "Culture" },
          { lessonNo: "22", chapterName: "Film and Print Media", type: "Culture" },
          { lessonNo: "23", chapterName: "Sports : Nationalism and Commerce", type: "Culture" },
          { lessonNo: "24", chapterName: "Disaster management", type: "Geography" }
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

    // Delete existing SSC Class 8 subjects to avoid duplicates
    await Subject.deleteMany({ grade: 8, board: "SSC" });
    console.log('Cleared existing SSC Class 8 data.');

    await Subject.insertMany(SSC_DATA);
    console.log('Successfully seeded SSC Class 8 data.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
