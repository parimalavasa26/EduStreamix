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
          { lessonNo: "1", chapterName: "बरसते बादल", videos: [{ language: "hindi", youtubeVideoId: "nVTPI64gRlU", embedUrl: "https://www.youtube.com/embed/nVTPI64gRlU" }] },
          { lessonNo: "2", chapterName: "लाख की चूड़ियाँ", videos: [{ language: "hindi", youtubeVideoId: "9ne5Km1_lx4", embedUrl: "https://www.youtube.com/embed/9ne5Km1_lx4" }] },
          { lessonNo: "3", chapterName: "बस की यात्रा", videos: [{ language: "hindi", youtubeVideoId: "ArnRlsKRlmM", embedUrl: "https://www.youtube.com/embed/ArnRlsKRlmM" }] },
          { lessonNo: "4", chapterName: "दीवानों की हस्ती", videos: [{ language: "hindi", youtubeVideoId: "65CY_296P5c", embedUrl: "https://www.youtube.com/embed/65CY_296P5c" }] },
          { lessonNo: "5", chapterName: "खेल जहाँ, मैदान वहाँ", videos: [{ language: "hindi", youtubeVideoId: "jItdhrPCp78", embedUrl: "https://www.youtube.com/embed/jItdhrPCp78" }] },
          { lessonNo: "6", chapterName: "चिड़ियों की अनूठी दुनिया", videos: [{ language: "hindi", youtubeVideoId: "ntyYXqL-RFA", embedUrl: "https://www.youtube.com/embed/ntyYXqL-RFA" }] },
          { lessonNo: "7", chapterName: "अरमान", videos: [{ language: "hindi", youtubeVideoId: "1ntIO_AUL9k", embedUrl: "https://www.youtube.com/embed/1ntIO_AUL9k" }] },
          { lessonNo: "8", chapterName: "कामचोर", videos: [{ language: "hindi", youtubeVideoId: "kDyJ3sjUMiw", embedUrl: "https://www.youtube.com/embed/kDyJ3sjUMiw" }] },
          { lessonNo: "9", chapterName: "क्या निराश हुआ जाए", videos: [{ language: "hindi", youtubeVideoId: "S6eCZ2Gjvlg", embedUrl: "https://www.youtube.com/embed/S6eCZ2Gjvlg" }] },
          { lessonNo: "10", chapterName: "शुक्रिया निकुम्भ सर", videos: [{ language: "hindi", youtubeVideoId: "o8AIc3VG9Rw", embedUrl: "https://www.youtube.com/embed/o8AIc3VG9Rw" }] },
          { lessonNo: "11", chapterName: "कबीर की साखियाँ", videos: [{ language: "hindi", youtubeVideoId: "kqnbJPtmAh4", embedUrl: "https://www.youtube.com/embed/kqnbJPtmAh4" }] },
          { lessonNo: "12", chapterName: "जब सिनेमा ने बोलना सीखा", videos: [{ language: "hindi", youtubeVideoId: "MSNH0KvnJUg", embedUrl: "https://www.youtube.com/embed/MSNH0KvnJUg" }] },
          { lessonNo: "13", chapterName: "दो कलाकार", videos: [{ language: "hindi", youtubeVideoId: "fr_THEdHamk", embedUrl: "https://www.youtube.com/embed/fr_THEdHamk" }] },
          { lessonNo: "14", chapterName: "सुदामा चरित", videos: [{ language: "hindi", youtubeVideoId: "0SQcCQdMYgc", embedUrl: "https://www.youtube.com/embed/0SQcCQdMYgc" }] },
          { lessonNo: "15", chapterName: "जहाँ पहिया है", videos: [{ language: "hindi", youtubeVideoId: "EIecveYEqOo", embedUrl: "https://www.youtube.com/embed/EIecveYEqOo" }] },
          { lessonNo: "16", chapterName: "पानी की कहानी", videos: [{ language: "hindi", youtubeVideoId: "3nkJctuJSS4", embedUrl: "https://www.youtube.com/embed/3nkJctuJSS4" }] },
          { lessonNo: "17", chapterName: "हमारा संकल्प", videos: [{ language: "hindi", youtubeVideoId: "jovAiplWQ68", embedUrl: "https://www.youtube.com/embed/jovAiplWQ68" }] },
          { lessonNo: "18", chapterName: "सूरदास के पद", videos: [{ language: "hindi", youtubeVideoId: "s9tvlEWxhXE", embedUrl: "https://www.youtube.com/embed/s9tvlEWxhXE" }] },
          { lessonNo: "19", chapterName: "बाज़ और साँप", videos: [{ language: "hindi", youtubeVideoId: "k4aurJEh-Yw", embedUrl: "https://www.youtube.com/embed/k4aurJEh-Yw" }] },
          { lessonNo: "20", chapterName: "पहाड़ से ऊँचा आदमी", videos: [{ language: "hindi", youtubeVideoId: "dT1wO58GIuU", embedUrl: "https://www.youtube.com/embed/dT1wO58GIuU" }] }
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
          { lessonNo: "1", chapterName: "What is Science ?", videos: [{ language: "english", youtubeVideoId: "Kke8PSCQf9w", embedUrl: "https://www.youtube.com/embed/Kke8PSCQf9w" }] },
          { lessonNo: "2", chapterName: "Cell - The Basic Unit of Life", videos: [{ language: "english", youtubeVideoId: "DSUsN2t8EW8", embedUrl: "https://www.youtube.com/embed/DSUsN2t8EW8" }] },
          { lessonNo: "3", chapterName: "Microbial World -1", videos: [{ language: "english", youtubeVideoId: "qhZ6YTeBSbE", embedUrl: "https://www.youtube.com/embed/qhZ6YTeBSbE" }] },
          { lessonNo: "4", chapterName: "Microbial World - 2", videos: [{ language: "english", youtubeVideoId: "ArL40cB8MsQ", embedUrl: "https://www.youtube.com/embed/ArL40cB8MsQ" }] },
          { lessonNo: "5", chapterName: "Reproduction in Animals", videos: [{ language: "english", youtubeVideoId: "a0U8adAUix0", embedUrl: "https://www.youtube.com/embed/a0U8adAUix0" }] },
          { lessonNo: "6", chapterName: "Adolescence", videos: [{ language: "english", youtubeVideoId: "YymcY5ILKc4", embedUrl: "https://www.youtube.com/embed/YymcY5ILKc4" }] },
          { lessonNo: "7", chapterName: "Biodiversity and its Conservation", videos: [{ language: "english", youtubeVideoId: "RgMeRiij5Kk", embedUrl: "https://www.youtube.com/embed/RgMeRiij5Kk" }] },
          { lessonNo: "8", chapterName: "Different Ecosystems", videos: [{ language: "english", youtubeVideoId: "HnFNzCTlP68", embedUrl: "https://www.youtube.com/embed/HnFNzCTlP68" }] },
          { lessonNo: "9", chapterName: "Food Production from plants", videos: [{ language: "english", youtubeVideoId: "7xa4MHIAXgM", embedUrl: "https://www.youtube.com/embed/7xa4MHIAXgM" }] },
          { lessonNo: "10", chapterName: "Food Production from animals", videos: [{ language: "english", youtubeVideoId: "5XXrnhBJyPk", embedUrl: "https://www.youtube.com/embed/5XXrnhBJyPk" }] },
          { lessonNo: "11", chapterName: "Not for Drinking - Not for Breathing", videos: [{ language: "english", youtubeVideoId: "1kMGNE33V2U", embedUrl: "https://www.youtube.com/embed/1kMGNE33V2U" }] },
          { lessonNo: "12", chapterName: "Why do we fall ill ?", videos: [{ language: "english", youtubeVideoId: "umCqa2jz3FQ", embedUrl: "https://www.youtube.com/embed/umCqa2jz3FQ" }] }
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
          { lessonNo: "1", chapterName: "Reading and Analysis of Maps", videos: [{ language: "english", youtubeVideoId: "-Ptm256Ej_8", embedUrl: "https://www.youtube.com/embed/-Ptm256Ej_8" }] },
          { lessonNo: "2", chapterName: "Energy from the Sun", videos: [{ language: "english", youtubeVideoId: "hJubVcmuBtY", embedUrl: "https://www.youtube.com/embed/hJubVcmuBtY" }] },
          { lessonNo: "3", chapterName: "Earth Movements and Seasons", videos: [{ language: "english", youtubeVideoId: "Axg7DdJe53I", embedUrl: "https://www.youtube.com/embed/Axg7DdJe53I" }] },
          { lessonNo: "4", chapterName: "The Polar Regions", videos: [{ language: "english", youtubeVideoId: "lumdxjOvBls", embedUrl: "https://www.youtube.com/embed/lumdxjOvBls" }] },
          { lessonNo: "5", chapterName: "Forests : Using and Protecting Them", videos: [{ language: "english", youtubeVideoId: "zJy-svEjaZ8", embedUrl: "https://www.youtube.com/embed/zJy-svEjaZ8" }] },
          { lessonNo: "6", chapterName: "Minerals and Mining", videos: [{ language: "english", youtubeVideoId: "e7Kk2KAcDYo", embedUrl: "https://www.youtube.com/embed/e7Kk2KAcDYo" }] },
          { lessonNo: "7", chapterName: "Money and Banking", videos: [{ language: "english", youtubeVideoId: "qIZ4fcAfn6U", embedUrl: "https://www.youtube.com/embed/qIZ4fcAfn6U" }] },
          { lessonNo: "8", chapterName: "Impact of Technology on Livelihoods", videos: [{ language: "english", youtubeVideoId: "FMW3NwghLsQ", embedUrl: "https://www.youtube.com/embed/FMW3NwghLsQ" }] },
          { lessonNo: "9", chapterName: "Public Health and the Government", videos: [{ language: "english", youtubeVideoId: "wFTH0b10vjk", embedUrl: "https://www.youtube.com/embed/wFTH0b10vjk" }] },
          { lessonNo: "10", chapterName: "Landlords and Tenants under the British and the Nizam", videos: [{ language: "english", youtubeVideoId: "KzqrlrHEcTw", embedUrl: "https://www.youtube.com/embed/KzqrlrHEcTw" }] },
          { lessonNo: "11", chapterName: "National Movement – The Early Phase – 1885-1919", videos: [{ language: "english", youtubeVideoId: "QDNvsnN8FpQ", embedUrl: "https://www.youtube.com/embed/QDNvsnN8FpQ" }] },
          { lessonNo: "12", chapterName: "National Movement – The Last Phase 1919-1947", videos: [{ language: "english", youtubeVideoId: "iq42ul8u7oQ", embedUrl: "https://www.youtube.com/embed/iq42ul8u7oQ" }] },
          { lessonNo: "13", chapterName: "Freedom Movement in Hyderabad State", videos: [{ language: "english", youtubeVideoId: "RaL6fg-pN10", embedUrl: "https://www.youtube.com/embed/RaL6fg-pN10" }] },
          { lessonNo: "14", chapterName: "The Indian Constitution", videos: [{ language: "english", youtubeVideoId: "PAZDz1-WTgQ", embedUrl: "https://www.youtube.com/embed/PAZDz1-WTgQ" }] },
          { lessonNo: "15", chapterName: "Parliament and Central Government", videos: [{ language: "english", youtubeVideoId: "R8fE5UFcNYM", embedUrl: "https://www.youtube.com/embed/R8fE5UFcNYM" }] },
          { lessonNo: "16", chapterName: "Law and Justice – A Case Study", videos: [{ language: "english", youtubeVideoId: "MuWKH-R3bhM", embedUrl: "https://www.youtube.com/embed/MuWKH-R3bhM" }] },
          { lessonNo: "17", chapterName: "Abolition of Zamindari System", videos: [{ language: "english", youtubeVideoId: "RJrRN6m-rgU", embedUrl: "https://www.youtube.com/embed/RJrRN6m-rgU" }] },
          { lessonNo: "18", chapterName: "Understanding Poverty", videos: [{ language: "english", youtubeVideoId: "jhDNXQ6s-8s", embedUrl: "https://www.youtube.com/embed/jhDNXQ6s-8s" }] },
          { lessonNo: "19", chapterName: "Rights Approach to Development", videos: [{ language: "english", youtubeVideoId: "jAdhZX0TdrE", embedUrl: "https://www.youtube.com/embed/jAdhZX0TdrE" }] },
          { lessonNo: "20", chapterName: "Social and Religious Reform Movements", videos: [{ language: "english", youtubeVideoId: "x-m-zd0EEEg", embedUrl: "https://www.youtube.com/embed/x-m-zd0EEEg" }] },
          { lessonNo: "21", chapterName: "Understanding Secularism", videos: [{ language: "english", youtubeVideoId: "cOXr_GJCKbs", embedUrl: "https://www.youtube.com/embed/cOXr_GJCKbs" }] },
          { lessonNo: "22", chapterName: "Performing Arts and Artistes in Modern Times", videos: [{ language: "english", youtubeVideoId: "uuuZ7QRdsPA", embedUrl: "https://www.youtube.com/embed/uuuZ7QRdsPA" }] },
          { lessonNo: "23", chapterName: "Film and Print Media", videos: [{ language: "english", youtubeVideoId: "P3Nns_aBCIE", embedUrl: "https://www.youtube.com/embed/P3Nns_aBCIE" }] },
          { lessonNo: "24", chapterName: "Sports : Nationalism and Commerce", videos: [{ language: "english", youtubeVideoId: "1iuJPizbr38", embedUrl: "https://www.youtube.com/embed/1iuJPizbr38" }] },
          { lessonNo: "25", chapterName: "Disaster management", videos: [{ language: "english", youtubeVideoId: "mon5GsGUhU4", embedUrl: "https://www.youtube.com/embed/mon5GsGUhU4" }] }
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
