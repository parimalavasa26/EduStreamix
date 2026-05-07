require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');

const VIDEO_DATA = [
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Rational Numbers", url: "https://www.youtube.com/embed/GJnvCdnrgqQ", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Linear Equations in One Variable", url: "https://www.youtube.com/embed/_YkILElUy78", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Construction of Quadrilaterals", url: "https://www.youtube.com/embed/KJSAgTenbHk", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Exponents and Powers", url: "https://www.youtube.com/embed/kxo6TfPUXA0", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Comparing Quantities", url: "https://www.youtube.com/embed/C_pVYSHv0mk", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Square Roots and Cube Roots", url: "https://www.youtube.com/embed/UeXx3H-rxFg", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Frequency Distribution Tables and Graphs", url: "https://www.youtube.com/embed/PhbwrW6cg-k", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Exploring Geometrical Figures", url: "https://www.youtube.com/embed/3qYtJJQoIQc", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Area of Plane Figures", url: "https://www.youtube.com/embed/acZ31AQSYZY", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Direct and Inverse Proportions", url: "https://www.youtube.com/embed/wqbOcpbZeDI", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Algebraic Expressions", url: "https://www.youtube.com/embed/c0NgtjfTJBo", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Factorisation", url: "https://www.youtube.com/embed/1LibHHbAL28", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Visualizing 3-D in 2-D", url: "https://www.youtube.com/embed/QZ8oez8eUfA", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Surface Areas and Volumes", url: "https://www.youtube.com/embed/2rp_-h6PnFo", language: "English" },
  { grade: "8", board: "SSC", subject: "Mathematics", chapter: "Playing with Numbers", url: "https://www.youtube.com/embed/TgLC7rnGCCQ", language: "English" },

  // Physical Science
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Force", url: "https://www.youtube.com/embed/LSa17eedH9A", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Friction", url: "https://www.youtube.com/embed/nRSV1Y4XlhU", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Synthetic Fibres and Plastics", url: "https://www.youtube.com/embed/liOVoOcTc60", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Metals and Non metals", url: "https://www.youtube.com/embed/h8J50PTsGi0", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Sound", url: "https://www.youtube.com/embed/oerfY7B5eac", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Reflection of Light at plane surfaces", url: "https://www.youtube.com/embed/gGO9OnFy4r0", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Coal and Petroleum", url: "https://www.youtube.com/embed/82DpPEpENQ0", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Combustion, Fuels and flame", url: "https://www.youtube.com/embed/Pm0sXIW6UFo", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Electrical Conductivity of Liquids", url: "https://www.youtube.com/embed/Gn36nAwoIlw", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Some natural phenomena", url: "https://www.youtube.com/embed/HnO38IJw9HM", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Stars and the Solar system", url: "https://www.youtube.com/embed/EghbLNO1Z30", language: "English" },
  { grade: "8", board: "SSC", subject: "Physical Science", chapter: "Graphs of Motion", url: "https://www.youtube.com/embed/Hd08eWaDUD0", language: "English" },

  // Biological Science
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "What is Science ?", url: "https://www.youtube.com/embed/Kke8PSCQf9w", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Cell - The Basic Unit of Life", url: "https://www.youtube.com/embed/DSUsN2t8EW8", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Microbial World -1", url: "https://www.youtube.com/embed/LFazSbt0njc", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Microbial World - 2", url: "https://www.youtube.com/embed/ArL40cB8MsQ", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Reproduction in Animals", url: "https://www.youtube.com/embed/Qw5AxNyzibMc", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Adolescence", url: "https://www.youtube.com/embed/YymcY5ILKc4", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Biodiversity and its Conservation", url: "https://www.youtube.com/embed/RgMeRiij5Kk", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Different Ecosystems", url: "https://www.youtube.com/embed/HnFNzCTlP68", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Food Production from plants", url: "https://www.youtube.com/embed/7xa4MHIAXgM", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Food Production from animals", url: "https://www.youtube.com/embed/5XXrnhBJyPk", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Not for Drinking - Not for Breathing", url: "https://www.youtube.com/embed/1kMGNE33V2U", language: "English" },
  { grade: "8", board: "SSC", subject: "Biological Science", chapter: "Why do we fall ill ?", url: "https://www.youtube.com/embed/umCqa2jz3FQ", language: "English" },

  // Social Studies
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Reading and Analysis of Maps", url: "https://www.youtube.com/embed/-Ptm256Ej_8", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Energy from the Sun", url: "https://www.youtube.com/embed/hJubVcmuBtY", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Earth Movements and Seasons", url: "https://www.youtube.com/embed/Axg7DdJe53I", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "The Polar Regions", url: "https://www.youtube.com/embed/lumdxjOvBls", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Forests : Using and Protecting Them", url: "https://www.youtube.com/embed/zJy-svEjaZ8", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Minerals and Mining", url: "https://www.youtube.com/embed/e7Kk2KAcDYo", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Money and Banking", url: "https://www.youtube.com/embed/qIZ4fcAfn6U", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Impact of Technology on Livelihoods", url: "https://www.youtube.com/embed/FMW3NwghLsQ", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Public Health and the Government", url: "https://www.youtube.com/embed/wFTH0b10vjk", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Landlords and Tenants under the British and the Nizam", url: "https://www.youtube.com/embed/KzqrlrHEcTw", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "National Movement – The Early Phase – 1885-1919", url: "https://www.youtube.com/embed/QDNvsnN8FpQ", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "National Movement – The Last Phase 1919-1947", url: "https://www.youtube.com/embed/iq42ul8u7oQ", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Freedom Movement in Hyderabad State", url: "https://www.youtube.com/embed/RaL6fg-pN10", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "The Indian Constitution", url: "https://www.youtube.com/embed/PAZDz1-WTgQ", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Parliament and Central Government", url: "https://www.youtube.com/embed/Xb_-GQh3y6k", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Law and Justice – A Case Study", url: "https://www.youtube.com/embed/reXkfmMNsco", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Abolition of Zamindari System", url: "https://www.youtube.com/embed/jAdhZX0TdrE", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Understanding Poverty", url: "https://www.youtube.com/embed/PQazbP8m_YA", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Rights Approach to Development", url: "https://www.youtube.com/embed/9uu_SOSYzug", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Social and Religious Reform Movements", url: "https://www.youtube.com/embed/uuuZ7QRdsPA", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Understanding Secularism", url: "https://www.youtube.com/embed/P3Nns_aBCIE", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Performing Arts and Artistes in Modern Times", url: "https://www.youtube.com/embed/1iuJPizbr38", language: "English" },
  { grade: "8", board: "SSC", subject: "Social Studies", chapter: "Film and Print Media", url: "https://www.youtube.com/embed/H3wYcbIqHmY", language: "English" },

  // Hindi
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "बरसते बादल", url: "https://www.youtube.com/embed/Eog6kFSOFz", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "लाख की चूड़ियाँ", url: "https://www.youtube.com/embed/9ne5Km1_lx4", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "बस की यात्रा", url: "https://www.youtube.com/embed/i8hAAOhD3dQ", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "दीवानों की हस्ती", url: "https://www.youtube.com/embed/65CY_296P5c", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "खेल जहाँ, मैदान वहाँ", url: "https://www.youtube.com/embed/jItdhrPCp78", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "चिड़ियों की अनूठी दुनिया", url: "https://www.youtube.com/embed/wS4sG2SpuhI", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "अरमान", url: "https://www.youtube.com/embed/1ntIO_AUL9k", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "कामचोर", url: "https://www.youtube.com/embed/kDyJ3sjUMiw", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "क्या निराश हुआ जाए", url: "https://www.youtube.com/embed/S6eCZ2Gjvlg", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "शुक्रिया निकुम्भ सर", url: "https://www.youtube.com/embed/o8AIc3VG9Rw", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "कबीर की साखियाँ", url: "https://www.youtube.com/embed/kqnbJPtmAh4", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "जब सिनेमा ने बोलना सीखा", url: "https://www.youtube.com/embed/MSNH0KvnJUg", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "दो कलाकार", url: "https://www.youtube.com/embed/fr_THEdHamk", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "सुదాमा चरित", url: "https://www.youtube.com/embed/AqLRXcvhLWw", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "जहाँ पहिया है", url: "https://www.youtube.com/embed/EIecveYEqOo", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "पानी की कहानी", url: "https://www.youtube.com/embed/3nkJctuJSS4", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "हमारा संकल्प", url: "https://www.youtube.com/embed/jovAiplWQ68", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "सूरदास के पद", url: "https://www.youtube.com/embed/ANHHrkER0Zg", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "बाज़ और साँप", url: "https://www.youtube.com/embed/k4aurJEh-Yw", language: "Hindi" },
  { grade: "8", board: "SSC", subject: "Hindi", chapter: "पहाड़ से ऊँचा आदमी", url: "https://www.youtube.com/embed/T8OA3fy-Eqk", language: "Hindi" },

  // Telugu
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "త్యాగనిరతి", url: "https://www.youtube.com/embed/JzpzGiV1moc", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "సముద్ర ప్రయాణం", url: "https://www.youtube.com/embed/sp4u_YkkK5s", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "బండారి బసవన్న", url: "https://www.youtube.com/embed/_cR0ThPhVDI", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "అసామాన్యులు", url: "https://www.youtube.com/embed/ZF1VatG0f5s", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "శతకసుధ", url: "https://www.youtube.com/embed/qzWOZ5HpM1k", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "తెలుగు జానపద గేయాలు", url: "https://www.youtube.com/embed/f80RURppisQ", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "మంజీరా", url: "https://www.youtube.com/embed/SeY-xpQfAAA", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "చిన్నప్పుడే", url: "https://www.youtube.com/embed/mB4wmCkY_nM", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "అమరులు", url: "https://www.youtube.com/embed/hJlq4zL39kM", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "సింగరేణి", url: "https://www.youtube.com/embed/SOaqm4aO7so", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "కాపుబిడ్డ", url: "https://www.youtube.com/embed/UBTPlAeDqtc", language: "Telugu" },
  { grade: "8", board: "SSC", subject: "Telugu", chapter: "మాట్లాడే నాగలి", url: "https://www.youtube.com/embed/dJzGlqodaRo", language: "Telugu" },

  // English
  { grade: "8", board: "SSC", subject: "English", chapter: "The Tattered Blanket", url: "https://www.youtube.com/embed/_04n9yQz6lM", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "My Mother (Poem)", url: "https://www.youtube.com/embed/fbcxv8IYyIg", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Letter to a Friend", url: "https://www.youtube.com/embed/EOzLLWwqxN0", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Oliver Asks for More", url: "https://www.youtube.com/embed/vlLgJQYmzlE", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Cry of Children (Poem)", url: "https://www.youtube.com/embed/Zw6cP01bwno", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Reaching the Unreached", url: "https://www.youtube.com/embed/HUJRVDN099U", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Selfish Giant (Part I)", url: "https://www.youtube.com/embed/U1xIMl5MRls", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Selfish Giant (Part II)", url: "https://www.youtube.com/embed/pVhTAqLqXB0", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Garden Within (Poem)", url: "https://www.youtube.com/embed/amfoaOCIU14", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Fun They Had", url: "https://www.youtube.com/embed/knz2DJr7wME", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Preteen Pretext (Poem)", url: "https://www.youtube.com/embed/y0rBCBfAxAE", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Computer Game", url: "https://www.youtube.com/embed/ixiuTV6b0xw", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Treasure Within – Part I", url: "https://www.youtube.com/embed/yjsyMenpZL4", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Treasure Within – Part II", url: "https://www.youtube.com/embed/Mo8lIwvU--s", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "They Literally Build the Nation", url: "https://www.youtube.com/embed/F9qasRm_3tE", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Story of Ikat", url: "https://www.youtube.com/embed/8MJswErPLig", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Earthen Goblet (Poem)", url: "https://www.youtube.com/embed/RkVySB8Epgg", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Maestro with a Mission", url: "https://www.youtube.com/embed/NTbgNVxV35Q", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Bonsai Life – Part I", url: "https://www.youtube.com/embed/KiZpTZVck3k", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Bonsai Life – Part II", url: "https://www.youtube.com/embed/aruH-l6lSf0", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "I Can Take Care of Myself", url: "https://www.youtube.com/embed/ru41LK69oHI", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Dr. Dwarakanath Kotnis", url: "https://www.youtube.com/embed/vNxt5Sy8l4Y", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "Be Thankful (Poem)", url: "https://www.youtube.com/embed/awd8suTeJqA", language: "English" },
  { grade: "8", board: "SSC", subject: "English", chapter: "The Dead Rat", url: "https://www.youtube.com/embed/p8Z2Ww_ZqJs", language: "English" }
];

async function seedVideos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Clearing existing video data for Class 8 SSC...');
    await Video.deleteMany({ grade: "8", board: "SSC" });

    console.log('Inserting new video links...');
    await Video.insertMany(VIDEO_DATA);

    console.log('✅ Successfully connected all Mathematics videos!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding videos:', err);
    process.exit(1);
  }
}

seedVideos();
