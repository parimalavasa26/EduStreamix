require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edustreamix';

const QUIZ_DATA_CBSE_8 = {
  'Mathematics': {
    'Rational Numbers': [
      { question: 'What is the additive identity for rational numbers?', options: ['0', '1', '-1', 'None'], correctAnswer: 0 },
      { question: 'What is the multiplicative inverse of 2/3?', options: ['-2/3', '3/2', '-3/2', '1'], correctAnswer: 1 },
      { question: 'Rational numbers are closed under which operation?', options: ['Addition', 'Subtraction', 'Multiplication', 'All of these'], correctAnswer: 3 }
    ],
    'Powers and Exponents': [
      { question: 'What is the value of a^0 (where a ≠ 0)?', options: ['0', 'a', '1', '-1'], correctAnswer: 2 },
      { question: 'What is (2^3)^2 equal to?', options: ['2^5', '2^6', '2^9', '2^1'], correctAnswer: 1 },
      { question: 'What is the value of 5^-2?', options: ['-25', '1/25', '25', '-1/25'], correctAnswer: 1 }
    ],
    'Squares and Square Roots': [
      { question: 'What is the square of 15?', options: ['125', '225', '625', '255'], correctAnswer: 1 },
      { question: 'How many natural numbers lie between 9^2 and 10^2?', options: ['18', '19', '20', '17'], correctAnswer: 0 },
      { question: 'What is the square root of 625?', options: ['15', '25', '35', '45'], correctAnswer: 1 }
    ],
    'Cubes and Cube Roots': [
      { question: 'What is the cube of 6?', options: ['36', '216', '126', '66'], correctAnswer: 1 },
      { question: 'What is the smallest number by which 81 must be divided to get a perfect cube?', options: ['3', '9', '27', '81'], correctAnswer: 0 },
      { question: 'What is the cube root of 1000?', options: ['10', '100', '1', '1000'], correctAnswer: 0 }
    ],
    'Algebraic Expressions': [
      { question: 'What is the value of (a+b)^2?', options: ['a^2+b^2', 'a^2+2ab+b^2', 'a^2-2ab+b^2', 'a^2+ab+b^2'], correctAnswer: 1 },
      { question: 'What is the degree of the polynomial 4x^3 + 2x^2 + x + 5?', options: ['1', '2', '3', '5'], correctAnswer: 2 },
      { question: 'Simplify: (x+3)(x+3)', options: ['x^2+9', 'x^2+6x+9', 'x^2-6x+9', '2x+6'], correctAnswer: 1 }
    ],
    'Linear Equations in One Variable': [
      { question: 'Solve for x: 3x + 5 = 14', options: ['3', '4', '5', '2'], correctAnswer: 0 },
      { question: 'If the sum of two numbers is 25 and one is 5 more than the other, what is the larger number?', options: ['10', '15', '20', '12.5'], correctAnswer: 1 },
      { question: 'Which of the following is a linear equation?', options: ['x^2 + 1 = 0', 'x + 5 = 0', 'xy + 1 = 0', '1/x + 1 = 0'], correctAnswer: 1 }
    ],
    'Understanding Quadrilaterals': [
      { question: 'What is the sum of interior angles of a quadrilateral?', options: ['180°', '360°', '540°', '720°'], correctAnswer: 1 },
      { question: 'Which quadrilateral has all sides equal but not necessarily all angles equal?', options: ['Square', 'Rectangle', 'Rhombus', 'Parallelogram'], correctAnswer: 2 },
      { question: 'A regular polygon has n sides. What is the measure of each exterior angle?', options: ['360/n', '180(n-2)/n', '180/n', '360(n-2)/n'], correctAnswer: 0 }
    ],
    'Practical Geometry': [
      { question: 'How many independent measurements are required to construct a unique quadrilateral?', options: ['3', '4', '5', '6'], correctAnswer: 2 },
      { question: 'To construct a square, we need to know at least:', options: ['One side', 'Two sides', 'One diagonal', 'All angles'], correctAnswer: 0 },
      { question: 'Can a quadrilateral be constructed with 3 sides and 2 included angles?', options: ['Yes', 'No', 'Only if it is a square', 'Only if it is a rectangle'], correctAnswer: 0 }
    ],
    'Mensuration': [
      { question: 'What is the area of a circle with radius r?', options: ['2πr', 'πr^2', '2πr^2', 'πr'], correctAnswer: 1 },
      { question: 'What is the volume of a cylinder with base radius r and height h?', options: ['πr^2h', '2πrh', '1/3πr^2h', 'πrh^2'], correctAnswer: 0 },
      { question: 'The total surface area of a cube with side "a" is:', options: ['a^3', '4a^2', '6a^2', '12a'], correctAnswer: 2 }
    ],
    'Data Handling': [
      { question: 'What is the probability of getting a head when a coin is tossed?', options: ['0', '1', '1/2', '1/4'], correctAnswer: 2 },
      { question: 'In a pie chart, the total angle at the center is:', options: ['90°', '180°', '270°', '360°'], correctAnswer: 3 },
      { question: 'The difference between the upper limit and lower limit of a class is called:', options: ['Class mark', 'Class size', 'Frequency', 'Mid-point'], correctAnswer: 1 }
    ],
    'Introduction to Graphs': [
      { question: 'The point (0, 5) lies on which axis?', options: ['X-axis', 'Y-axis', 'Origin', 'Neither'], correctAnswer: 1 },
      { question: 'The coordinates of the origin are:', options: ['(1, 1)', '(0, 0)', '(1, 0)', '(0, 1)'], correctAnswer: 1 },
      { question: 'In the point (3, 4), what is the x-coordinate (abscissa)?', options: ['3', '4', '7', '0'], correctAnswer: 0 }
    ],
    'Comparing Quantities': [
      { question: 'What is 20% of 500?', options: ['50', '100', '150', '200'], correctAnswer: 1 },
      { question: 'If CP = 200 and SP = 250, what is the profit percentage?', options: ['20%', '25%', '50%', '10%'], correctAnswer: 1 },
      { question: 'Compound interest formula is:', options: ['P(1 + r/100)^n', 'P(1 + r/100)^n - P', 'P * r * t / 100', 'P + I'], correctAnswer: 1 }
    ],
    'Direct and Inverse Proportions': [
      { question: 'If x and y are in direct proportion, then:', options: ['xy = k', 'x/y = k', 'x+y = k', 'x-y = k'], correctAnswer: 1 },
      { question: 'If 5 men can build a wall in 10 days, how many days will 10 men take?', options: ['20', '5', '15', '10'], correctAnswer: 1 },
      { question: 'When the number of articles increases, the total cost increases. This is:', options: ['Direct proportion', 'Inverse proportion', 'No proportion', 'Random proportion'], correctAnswer: 0 }
    ],
    'Visualising Patterns': [
      { question: 'Which of the following is a 3D shape?', options: ['Circle', 'Triangle', 'Sphere', 'Square'], correctAnswer: 2 },
      { question: 'Euler\'s formula for polyhedrons is (F: Faces, V: Vertices, E: Edges):', options: ['F + V - E = 2', 'F + E - V = 2', 'V + E - F = 2', 'F + V + E = 2'], correctAnswer: 0 },
      { question: 'A pyramid has a square base. How many faces does it have?', options: ['4', '5', '6', '8'], correctAnswer: 1 }
    ]
  },
  'Science': {
    'Force and Pressure': [
      { question: 'Force per unit area is called:', options: ['Power', 'Work', 'Pressure', 'Energy'], correctAnswer: 2 },
      { question: 'Which of the following is a non-contact force?', options: ['Friction', 'Muscular force', 'Magnetic force', 'Applied force'], correctAnswer: 2 },
      { question: 'Atmospheric pressure is measured using a:', options: ['Thermometer', 'Barometer', 'Ammeter', 'Voltmeter'], correctAnswer: 1 }
    ],
    'Friction': [
      { question: 'Friction always opposes:', options: ['Motion', 'Rest', 'Shape', 'Weight'], correctAnswer: 0 },
      { question: 'Which type of friction is the smallest?', options: ['Static friction', 'Sliding friction', 'Rolling friction', 'Fluid friction'], correctAnswer: 2 },
      { question: 'Sprinkling of powder on a carrom board ________ friction.', options: ['Increases', 'Reduces', 'Does not change', 'Doubles'], correctAnswer: 1 }
    ],
    'Sound': [
      { question: 'Sound cannot travel through:', options: ['Solids', 'Liquids', 'Gases', 'Vacuum'], correctAnswer: 3 },
      { question: 'The frequency of infrasonic sound is:', options: ['Less than 20 Hz', 'More than 20,000 Hz', 'Between 20 Hz and 20,000 Hz', 'None'], correctAnswer: 0 },
      { question: 'Pitch of sound depends on its:', options: ['Amplitude', 'Frequency', 'Loudness', 'Speed'], correctAnswer: 1 }
    ],
    'Chemical Effects of Electric Current': [
      { question: 'Which of the following is a good conductor of electricity?', options: ['Distilled water', 'Plastic', 'Lemon juice', 'Rubber'], correctAnswer: 2 },
      { question: 'The process of depositing a layer of desired metal on another material is:', options: ['Electrolysis', 'Electroplating', 'Conduction', 'Insulation'], correctAnswer: 1 },
      { question: 'Which electrode is connected to the positive terminal of a battery?', options: ['Anode', 'Cathode', 'Neutrode', 'None'], correctAnswer: 0 }
    ],
    'Synthetic Fibres and Plastics': [
      { question: 'Which of the following is a synthetic fibre?', options: ['Cotton', 'Wool', 'Nylon', 'Silk'], correctAnswer: 2 },
      { question: 'Plastics that can be softened by heating are called:', options: ['Thermosetting plastics', 'Thermoplastics', 'Natural plastics', 'Elastic plastics'], correctAnswer: 1 },
      { question: 'Rayon is also known as:', options: ['Artificial Silk', 'Artificial Wool', 'Artificial Cotton', 'Pure Silk'], correctAnswer: 0 }
    ],
    'Metals and Non-Metals': [
      { question: 'Which metal is found in liquid state at room temperature?', options: ['Iron', 'Sodium', 'Mercury', 'Gold'], correctAnswer: 2 },
      { question: 'The property of metals by which they can be beaten into thin sheets is:', options: ['Ductility', 'Malleability', 'Lustre', 'Sonority'], correctAnswer: 1 },
      { question: 'Which non-metal is a good conductor of electricity?', options: ['Sulfur', 'Phosphorus', 'Graphite', 'Iodine'], correctAnswer: 2 }
    ],
    'Coal and Petroleum': [
      { question: 'Which of the following is a fossil fuel?', options: ['Coal', 'Petroleum', 'Natural Gas', 'All of these'], correctAnswer: 3 },
      { question: 'The process of conversion of dead vegetation into coal is:', options: ['Refining', 'Carbonisation', 'Distillation', 'Vaporisation'], correctAnswer: 1 },
      { question: 'PCRA stands for:', options: ['Petroleum Conservation Research Association', 'Public Coal Research Agency', 'Power Conservation Resource Agency', 'None'], correctAnswer: 0 }
    ],
    'Combustion and Flame': [
      { question: 'The lowest temperature at which a substance catches fire is its:', options: ['Boiling point', 'Melting point', 'Ignition temperature', 'Critical temperature'], correctAnswer: 2 },
      { question: 'Which zone of a candle flame is the hottest?', options: ['Inner zone', 'Middle zone', 'Outer zone', 'Luminous zone'], correctAnswer: 2 },
      { question: 'A good fuel should have:', options: ['High calorific value', 'High ignition temperature', 'High cost', 'High ash content'], correctAnswer: 0 }
    ],
    'Cell - Structure and Functions': [
      { question: 'Who discovered the cell for the first time?', options: ['Robert Hooke', 'Antony van Leeuwenhoek', 'Robert Brown', 'Charles Darwin'], correctAnswer: 0 },
      { question: 'Which cell organelle is known as the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Vacuole'], correctAnswer: 1 },
      { question: 'The control center of the cell is the:', options: ['Cell wall', 'Cytoplasm', 'Nucleus', 'Golgi body'], correctAnswer: 2 }
    ],
    'Reproduction in Animals': [
      { question: 'Reproduction which involves the fusion of male and female gametes is:', options: ['Asexual', 'Sexual', 'Budding', 'Fragmentation'], correctAnswer: 1 },
      { question: 'Animals which give birth to young ones are called:', options: ['Oviparous', 'Viviparous', 'Parasites', 'Herbivores'], correctAnswer: 1 },
      { question: 'The fusion of sperm and egg is called:', options: ['Fertilisation', 'Pollination', 'Embryology', 'Metamorphosis'], correctAnswer: 0 }
    ],
    'Reaching the Age of Adolescence': [
      { question: 'The period of life when the body undergoes changes leading to reproductive maturity is:', options: ['Childhood', 'Adolescence', 'Old age', 'Infancy'], correctAnswer: 1 },
      { question: 'Which hormone is responsible for secondary sexual characters in males?', options: ['Estrogen', 'Testosterone', 'Insulin', 'Thyroxine'], correctAnswer: 1 },
      { question: 'Adam\'s apple is the enlarged:', options: ['Pharynx', 'Larynx', 'Trachea', 'Esophagus'], correctAnswer: 1 }
    ],
    'Microorganisms: Friend and Foe': [
      { question: 'Bacteria that help in the setting of curd is:', options: ['Rhizobium', 'Lactobacillus', 'Yeast', 'Penicillium'], correctAnswer: 1 },
      { question: 'Which of the following is an antibiotic?', options: ['Sodium bicarbonate', 'Streptomycin', 'Alcohol', 'Yeast'], correctAnswer: 1 },
      { question: 'Malaria is caused by:', options: ['Bacteria', 'Virus', 'Protozoa', 'Fungi'], correctAnswer: 2 }
    ],
    'Pollution of Air and Water': [
      { question: 'Which gas is mainly responsible for global warming?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correctAnswer: 2 },
      { question: 'Water that is fit for drinking is called:', options: ['Pure water', 'Potable water', 'Mineral water', 'Distilled water'], correctAnswer: 1 },
      { question: 'Gangotri glacier is melting primarily due to:', options: ['Acid rain', 'Global warming', 'Deforestation', 'Ozone depletion'], correctAnswer: 1 }
    ],
    'Some Natural Phenomena': [
      { question: 'Which instrument is used to measure the intensity of an earthquake?', options: ['Barometer', 'Seismograph', 'Richter scale', 'Thermometer'], correctAnswer: 2 },
      { question: 'The process of transferring charge from a charged object to the earth is:', options: ['Charging', 'Earthing', 'Lighting', 'Thunder'], correctAnswer: 1 },
      { question: 'Like charges ________ each other.', options: ['Attract', 'Repel', 'Neutralise', 'None'], correctAnswer: 1 }
    ],
    'Light': [
      { question: 'Angle of incidence is always ________ the angle of reflection.', options: ['Greater than', 'Less than', 'Equal to', 'Half of'], correctAnswer: 2 },
      { question: 'The small opening in the iris is called:', options: ['Pupil', 'Cornea', 'Retina', 'Lens'], correctAnswer: 0 },
      { question: 'The defect of vision in which a person cannot see nearby objects clearly is:', options: ['Myopia', 'Hypermetropia', 'Cataract', 'Night blindness'], correctAnswer: 1 }
    ],
    'Stars and The Solar System': [
      { question: 'Which is the largest planet in our solar system?', options: ['Saturn', 'Jupiter', 'Neptune', 'Earth'], correctAnswer: 1 },
      { question: 'The "Morning Star" or "Evening Star" is actually the planet:', options: ['Mars', 'Venus', 'Mercury', 'Saturn'], correctAnswer: 1 },
      { question: 'Halley\'s Comet appears after every ________ years.', options: ['56', '76', '86', '106'], correctAnswer: 1 }
    ],
    'Conservation of Plants and Animals': [
      { question: 'The species which are at the verge of extinction are called:', options: ['Extinct species', 'Endangered species', 'Endemic species', 'Native species'], correctAnswer: 1 },
      { question: 'Red Data Book keeps a record of all:', options: ['Endangered animals', 'Endangered plants', 'Endangered species', 'Extinct species'], correctAnswer: 2 },
      { question: 'The process of clearing forests is called:', options: ['Reforestation', 'Afforestation', 'Deforestation', 'Desertification'], correctAnswer: 2 }
    ]
  },
  'Hindi': {
    'स्वदेश': [
      { question: 'स्वदेश शब्द का क्या अर्थ है?', options: ['अपना देश', 'दूसरा देश', 'विदेशी देश', 'पड़ोसी देश'], correctAnswer: 0 },
      { question: 'इस पाठ का मुख्य भाव क्या है?', options: ['देशप्रेम', 'प्रकृति प्रेम', 'पशु प्रेम', 'इनमें से कोई नहीं'], correctAnswer: 0 },
      { question: 'कवि ने किसे सबसे सुंदर बताया है?', options: ['पर्वत', 'नदी', 'स्वदेश', 'आकाश'], correctAnswer: 2 }
    ],
    'दो गौरैया': [
      { question: 'गौरैया क्या है?', options: ['एक पशु', 'एक पक्षी', 'एक मछली', 'एक कीट'], correctAnswer: 1 },
      { question: 'लेखक के घर में घोंसला किसने बनाया था?', options: ['कौआ', 'मैना', 'गौरैया', 'कबूतर'], correctAnswer: 2 },
      { question: 'गौरैया पाठ से क्या सीख मिलती है?', options: ['जीवों के प्रति दया', 'प्रदूषण', 'पढाई', 'खेल'], correctAnswer: 0 }
    ],
    'मित्रलाभ': [
      { question: 'मित्रलाभ का अर्थ क्या है?', options: ['मित्र का नुकसान', 'मित्र का मिलना', 'मित्र से लाभ', 'मित्र का जाना'], correctAnswer: 2 },
      { question: 'सच्चा मित्र कौन होता है?', options: ['जो संकट में साथ दे', 'जो पैसे दे', 'जो साथ खेले', 'जो साथ पढ़े'], correctAnswer: 0 },
      { question: 'इस पाठ में किन जानवरों की मित्रता दिखाई गई है?', options: ['शेर और चूहा', 'कौआ, मृग, चूहा और कछुआ', 'गाय और भैंस', 'बंदर और मगरमच्छ'], correctAnswer: 1 }
    ]
  },
  'English': {
    'The Wit that Won Hearts': [
      { question: 'What does "wit" mean in the title?', options: ['Physical strength', 'Intelligence and humor', 'Wealth', 'Fear'], correctAnswer: 1 },
      { question: 'In the story, who uses their wit to solve a problem?', options: ['The King', 'The Minister', 'The Protagonist', 'The Soldier'], correctAnswer: 2 },
      { question: 'What is the theme of the story?', options: ['War', 'Bravery', 'Mental sharpness', 'Nature'], correctAnswer: 2 }
    ],
    'A Concrete Example': [
      { question: 'What is the meaning of "concrete" in this context?', options: ['Building material', 'Specific and clear', 'Hard', 'Hidden'], correctAnswer: 1 },
      { question: 'Why is the example given in the story important?', options: ['To confuse', 'To illustrate a point clearly', 'To waste time', 'To entertain'], correctAnswer: 1 },
      { question: 'The story teaches us to be:', options: ['Vague', 'Precise', 'Careless', 'Angry'], correctAnswer: 1 }
    ]
  },
  'Social Science': {
    'How, When and Where': [
      { question: 'Who was the first Governor-General of India?', options: ['Lord Dalhousie', 'Warren Hastings', 'Lord Mountbatten', 'Robert Clive'], correctAnswer: 1 },
      { question: 'James Mill divided Indian history into three periods. Which was NOT one of them?', options: ['Hindu', 'Muslim', 'British', 'Christian'], correctAnswer: 3 },
      { question: 'The practice of surveying became common under which administration?', options: ['Mughal', 'British', 'Maratha', 'Mauryan'], correctAnswer: 1 }
    ],
    'From Trade to Territory': [
      { question: 'In which year did the Battle of Plassey take place?', options: ['1757', '1764', '1857', '1707'], correctAnswer: 0 },
      { question: 'The Battle of Buxar (1764) was fought between the British and:', options: ['Siraj-ud-Daulah', 'Mir Qasim', 'Tipu Sultan', 'Haidar Ali'], correctAnswer: 1 },
      { question: 'Who introduced the "Doctrine of Lapse"?', options: ['Lord Wellesley', 'Lord Dalhousie', 'Lord Cornwallis', 'Lord Hastings'], correctAnswer: 1 }
    ],
    'The Indian Constitution': [
      { question: 'When did the Indian Constitution come into effect?', options: ['15 August 1947', '26 November 1949', '26 January 1950', '30 January 1948'], correctAnswer: 2 },
      { question: 'Who is known as the "Father of the Indian Constitution"?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Dr. B.R. Ambedkar', 'Sardar Patel'], correctAnswer: 2 },
      { question: 'The right to vote is given to every citizen of India who is above ________ years of age.', options: ['15', '18', '21', '25'], correctAnswer: 1 }
    ],
    'Resources': [
      { question: 'Which of the following is a human-made resource?', options: ['Spring water', 'Tropical forests', 'Medicines to treat cancer', 'Iron ore'], correctAnswer: 2 },
      { question: 'Resources that are found everywhere are called:', options: ['Localized resources', 'Ubiquitous resources', 'Actual resources', 'Potential resources'], correctAnswer: 1 },
      { question: 'Sustainable development means:', options: ['Using all resources', 'Saving all resources', 'Balancing the need to use resources and conserve them for the future', 'Ignoring resources'], correctAnswer: 2 }
    ],
    'The Story of Village Palampur': [
      { question: 'What is the main production activity in Palampur?', options: ['Manufacturing', 'Dairy', 'Farming', 'Transport'], correctAnswer: 2 },
      { question: 'Which of the following is a fixed capital?', options: ['Money', 'Raw materials', 'Machines', 'Labor'], correctAnswer: 2 },
      { question: 'HYV seeds stand for:', options: ['High Yielding Variety', 'Heavy Yielding Volume', 'Half Yielding Value', 'High Yearly Value'], correctAnswer: 0 }
    ]
  }
};

async function seedQuizzes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('Connected.');

    for (const subjectName in QUIZ_DATA_CBSE_8) {
      const subjectDoc = await Subject.findOne({ grade: 8, board: 'CBSE', subject: subjectName });
      if (!subjectDoc) {
        console.log(`Subject ${subjectName} not found, skipping...`);
        continue;
      }

      console.log(`Updating quizzes for ${subjectName}...`);
      let updated = false;

      for (const unit of subjectDoc.units) {
        for (const chapter of unit.chapters) {
          const questions = QUIZ_DATA_CBSE_8[subjectName][chapter.chapterName];
          if (questions) {
            chapter.quizQuestions = questions;
            updated = true;
          }
        }
      }

      if (updated) {
        await subjectDoc.save();
        console.log(`✅ Successfully updated quizzes for ${subjectName}`);
      }
    }

    console.log('All updates complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
}

seedQuizzes();
