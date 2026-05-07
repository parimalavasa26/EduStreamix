require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const connectDB = require('../config/db');

// --- CBSE Data ---
const cbse_maths = [
    "Rational Numbers",
    "Powers and Exponents",
    "Squares and Square Roots",
    "Cubes and Cube Roots",
    "Algebraic Expressions",
    "Linear Equations in One Variable",
    "Understanding Quadrilaterals",
    "Practical Geometry",
    "Mensuration",
    "Data Handling",
    "Introduction to Graphs",
    "Comparing Quantities",
    "Direct and Inverse Proportions",
    "Visualising Patterns"
];

const cbse_physics = [
    "Force and Pressure",
    "Friction",
    "Sound",
    "Chemical Effects of Electric Current",
    "Synthetic Fibres and Plastics",
    "Metals and Non-Metals",
    "Coal and Petroleum",
    "Combustion and Flame",
    "Cell - Structure and Functions",
    "Reproduction in Animals",
    "Reaching the Age of Adolescence",
    "Microorganisms: Friend and Foe",
    "Pollution of Air and Water",
    "Some Natural Phenomena",
    "Light",
    "Stars and The Solar System",
    "Conservation of Plants and Animals"
];

const cbse_social = [
    "How, When and Where",
    "From Trade to Territory",
    "Ruling the Countryside",
    "Tribals, Dikus and the Vision of a Golden Age",
    "When People Rebel (1857 and After)",
    "Colonialism and the City",
    "Weavers, Iron Smelters and Factory Owners",
    "Civilising the “Native”, Educating the Nation",
    "Women, Caste and Reform",
    "The Changing World of Visual Arts",
    "The Making of the National Movement (1870–1947)",
    "India After Independence",
    "Resources",
    "Land, Soil, Water, Natural Vegetation and Wildlife Resources",
    "Mineral and Power Resources",
    "Agriculture",
    "Industries",
    "Human Resources",
    "The Indian Constitution",
    "Understanding Secularism",
    "Why Do We Need a Parliament?",
    "Understanding Laws",
    "Judiciary",
    "Understanding Our Criminal Justice System",
    "Understanding Marginalisation",
    "Confronting Marginalisation",
    "Public Facilities",
    "Law and Social Justice",
    "The Story of Village Palampur",
    "Role of the Government in Health",
    "How the Markets Work",
    "Globalisation and the Indian Economy",
    "Public Distribution System"
];

const cbse_hindi = [
    "स्वदेश",
    "दो गौरैया",
    "मित्रलाभ",
    "एक आशीर्वाद",
    "हरिद्वार",
    "कबीर के दोहे",
    "कदम मिलाकर चलना होगा",
    "एक टोकरी भर मिट्टी",
    "मत बाँधो",
    "नए मेहमान",
    "आदमी के अनुपात",
    "तरुण के स्वप्न",
    "भारती जब विषय करो"
];

const cbse_english = [
    "The Wit that Won Hearts",
    "A Concrete Example",
    "Wisdom Paves the Way",
    "A Tale of Valour: Major Somnath Sharma and the Battle of Badgam",
    "Somebody’s Mother",
    "Verghese Kurien – I Too Had a Dream",
    "The Case of the Fifth Word",
    "The Magic Brush of Dreams",
    "The Cherry Tree",
    "Harvest Hymn",
    "Feathered Friend",
    "Magnifying Glass",
    "Bibha Chowdhuri: The Beam of Light that Lit the Path for Women in Indian Science"
];

const cbse_data = {
    "Mathematics": cbse_maths,
    "Science": cbse_physics, // In the original file it's named physics, but usually it's Science for class 8. We'll map it to "Science" or "Physics". Wait, I'll name it "Physics" to be safe and match user's name if they specifically want it, but usually class 8 has Science. Let's name it "Science" because the syllabus contains bio and chem topics too (Microorganisms, Cell, Chemical Effects). Actually, wait. It is named `physics` in the user's file. I'll use "Science".
    "Social Science": cbse_social,
    "Hindi": cbse_hindi,
    "English": cbse_english
};


// --- SSC Data ---
const ssc_math = [
    "Rational Numbers",
    "Linear Equations in One Variable",
    "Construction of Quadrilaterals",
    "Exponents and Powers",
    "Comparing Quantities using Proportion",
    "Square Roots and Cube Roots",
    "Frequency Distribution Tables and Graphs",
    "Exploring Geometrical Figures",
    "Area of Plane Figures",
    "Direct and Inverse Proportions",
    "Algebraic Expressions",
    "Factorisation",
    "Visualizing 3-D in 2-D",
    "Surface Areas and Volumes (Cube-Cuboid)",
    "Playing with Numbers"
];

const ssc_physics = [
    "Force",
    "Friction",
    "Synthetic Fibres and Plastics",
    "Metals and Non metals",
    "Sound",
    "Reflection of Light at plane surfaces",
    "Coal and Petroleum",
    "Combustion, Fuels and flame",
    "Electrical Conductivity of Liquids",
    "Some natural phenomena",
    "Stars and the Solar system",
    "Graphs of Motion"
];

const ssc_bio = [
    "What is Science ?",
    "Cell - The Basic Unit of Life",
    "Microbial World -1",
    "Microbial World - 2",
    "Reproduction in Animals",
    "Adolescence",
    "Biodiversity and its Conservation",
    "Different Ecosystems",
    "Food Production from plants",
    "Food Production from animals",
    "Not for Drinking - Not for Breathing",
    "Why do we fall ill ?"
];

const ssc_socialStudies = [
    "Reading and Analysis of Maps",
    "Energy from the Sun",
    "Earth Movements and Seasons",
    "The Polar Regions",
    "Forests : Using and Protecting Them",
    "Minerals and Mining",
    "Money and Banking",
    "Impact of Technology on Livelihoods",
    "Public Health and the Government",
    "Landlords and Tenants under the British and the Nizam",
    "National Movement – The Early Phase – 1885-1919",
    "National Movement – The Last Phase 1919-1947",
    "Freedom Movement in Hyderabad State",
    "The Indian Constitution",
    "Parliament and Central Government",
    "Law and Justice – A Case Study",
    "Abolition of Zamindari System",
    "Understanding Poverty",
    "Rights Approach to Development",
    "Social and Religious Reform Movements",
    "Understanding Secularism",
    "Performing Arts and Artistes in Modern Times",
    "Film and Print Media",
    "Sports : Nationalism and Commerce",
    "Disaster management"
];

const ssc_hindi = [
    "बरसते बादल",
    "लाख की चूड़ियाँ",
    "बस की यात्रा",
    "दीवानों की हस्ती",
    "खेल जहाँ, मैदान वहाँ",
    "चिड़ियों की अनूठी दुनिया",
    "अरमान",
    "कामचोर",
    "क्या निराश हुआ जाए",
    "शुक्रिया निकुम्भ सर",
    "कबीर की साखियाँ",
    "जब सिनेमा ने बोलना सीखा",
    "दो कलाकार",
    "सुदामा चरित",
    "जहाँ पहिया है",
    "पानी की कहानी",
    "हमारा संकल्प",
    "सूरदास के पद",
    "बाज़ और साँप",
    "पहाड़ से ऊँचा आदमी"
];

const ssc_telugu = [
    "త్యాగనిరతి",
    "సముద్ర ప్రయాణం",
    "బండారి బసవన్న",
    "అసామాన్యులు",
    "శతకసుధ",
    "తెలుగు జానపద గేయాలు",
    "మంజీరా",
    "చిన్నప్పుడే",
    "అమరులు",
    "సింగరేణి",
    "కాపుబిడ్డ",
    "మాట్లాడే నాగలి"
];

const ssc_english = [
    "The Tattered Blanket",
    "My Mother (Poem)",
    "Letter to a Friend",
    "Oliver Asks for More",
    "The Cry of Children (Poem)",
    "Reaching the Unreached",
    "The Selfish Giant (Part I)",
    "The Selfish Giant (Part II)",
    "The Garden Within (Poem)",
    "The Fun They Had",
    "Preteen Pretext (Poem)",
    "The Computer Game",
    "The Treasure Within – Part I",
    "The Treasure Within – Part II",
    "They Literally Build the Nation",
    "The Story of Ikat",
    "The Earthen Goblet (Poem)",
    "Maestro with a Mission",
    "Bonsai Life – Part I",
    "Bonsai Life – Part II",
    "I Can Take Care of Myself",
    "Dr. Dwarakanath Kotnis",
    "Be Thankful (Poem)",
    "The Dead Rat"
];

const ssc_data = {
    "Mathematics": ssc_math,
    "Physical Science": ssc_physics,
    "Biological Science": ssc_bio,
    "Social Studies": ssc_socialStudies,
    "Hindi": ssc_hindi,
    "Telugu": ssc_telugu,
    "English": ssc_english
};


const seedData = async () => {
    try {
        await connectDB();
        
        // Remove existing class 8 CBSE and SSC syllabus
        await Subject.deleteMany({ grade: 8, board: { $in: ["CBSE", "SSC"] } });
        console.log('Cleared existing Grade 8 syllabus data for CBSE and SSC.');

        // Seed CBSE Class 8
        for (const [subjectName, chapters] of Object.entries(cbse_data)) {
            const units = [{
                unitName: "All Chapters",
                chapters: chapters.map((chapterName, idx) => ({
                    lessonNo: (idx + 1).toString(),
                    chapterName: chapterName
                }))
            }];
            
            const syllabusEntry = new Subject({
                grade: 8,
                board: "CBSE",
                subject: subjectName,
                units: units
            });
            
            await syllabusEntry.save();
            console.log(`Saved CBSE Class 8 syllabus for ${subjectName}`);
        }

        // Seed SSC Class 8
        for (const [subjectName, chapters] of Object.entries(ssc_data)) {
            const units = [{
                unitName: "All Chapters",
                chapters: chapters.map((chapterName, idx) => ({
                    lessonNo: (idx + 1).toString(),
                    chapterName: chapterName
                }))
            }];
            
            const syllabusEntry = new Subject({
                grade: 8,
                board: "SSC",
                subject: subjectName,
                units: units
            });
            
            await syllabusEntry.save();
            console.log(`Saved SSC Class 8 syllabus for ${subjectName}`);
        }
        
        console.log("Seeding complete!");
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedData();
