/* ════════════════════════════════════════════════
   EduStreamix — Quiz Question Bank
   ════════════════════════════════════════════════ */
window.QUIZ_DATA = {
  'Mathematics': [
    { question: 'What is the square root of 144?', options: ['10', '11', '12', '14'], answer: 2 },
    { question: 'If x + 5 = 12, what is x?', options: ['5', '6', '7', '8'], answer: 2 },
    { question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], answer: 2 },
    { question: 'What is the value of π (approx)?', options: ['3.14', '2.71', '1.61', '3.41'], answer: 0 },
    { question: 'Which is a prime number?', options: ['21', '22', '23', '24'], answer: 2 },
    { question: 'What is the LCM of 4 and 6?', options: ['8', '10', '12', '24'], answer: 2 },
    { question: 'Simplify: 3² + 4²', options: ['7', '12', '25', '49'], answer: 2 },
    { question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], answer: 1 }
  ],
  'Science': [
    { question: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], answer: 1 },
    { question: 'Which gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 2 },
    { question: 'What is the chemical formula of water?', options: ['H2O', 'CO2', 'NaCl', 'O2'], answer: 0 },
    { question: 'Which organ pumps blood?', options: ['Liver', 'Kidney', 'Heart', 'Lung'], answer: 2 },
    { question: 'Speed of light is approximately?', options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], answer: 0 },
    { question: 'What is the pH of pure water?', options: ['5', '7', '9', '14'], answer: 1 },
    { question: 'Photosynthesis occurs in which cell part?', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Ribosome'], answer: 2 },
    { question: 'Which metal is liquid at room temperature?', options: ['Iron', 'Mercury', 'Gold', 'Silver'], answer: 1 }
  ],
  'Physics': [
    { question: 'What is Newton\'s first law about?', options: ['Force', 'Inertia', 'Gravity', 'Energy'], answer: 1 },
    { question: 'Unit of electric current is?', options: ['Volt', 'Ohm', 'Ampere', 'Watt'], answer: 2 },
    { question: 'What is acceleration due to gravity?', options: ['8.9 m/s²', '9.8 m/s²', '10.8 m/s²', '7.8 m/s²'], answer: 1 },
    { question: 'Which lens is used for short-sightedness?', options: ['Convex', 'Concave', 'Bifocal', 'Cylindrical'], answer: 1 },
    { question: 'Sound cannot travel through?', options: ['Water', 'Air', 'Steel', 'Vacuum'], answer: 3 },
    { question: 'What does KE stand for?', options: ['Kinetic Energy', 'Known Energy', 'Key Energy', 'Kelvin Energy'], answer: 0 }
  ],
  'Chemistry': [
    { question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], answer: 1 },
    { question: 'Which is an acid?', options: ['NaOH', 'HCl', 'NaCl', 'KOH'], answer: 1 },
    { question: 'Rusting of iron is?', options: ['Physical change', 'Chemical change', 'No change', 'Nuclear change'], answer: 1 },
    { question: 'What is the valency of Oxygen?', options: ['1', '2', '3', '4'], answer: 1 },
    { question: 'Baking soda formula is?', options: ['NaCl', 'NaHCO₃', 'Na₂CO₃', 'NaOH'], answer: 1 },
    { question: 'Which gas is used in fire extinguishers?', options: ['O₂', 'N₂', 'CO₂', 'H₂'], answer: 2 }
  ],
  'Biology': [
    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], answer: 1 },
    { question: 'DNA stands for?', options: ['Deoxyribonucleic Acid', 'Dinitro Acid', 'Dioxyribose Acid', 'None'], answer: 0 },
    { question: 'Which blood cells fight infection?', options: ['RBC', 'WBC', 'Platelets', 'Plasma'], answer: 1 },
    { question: 'Largest organ of human body?', options: ['Liver', 'Brain', 'Skin', 'Heart'], answer: 2 },
    { question: 'Photosynthesis produces?', options: ['CO₂', 'O₂', 'N₂', 'H₂'], answer: 1 },
    { question: 'Which vitamin is produced by sunlight?', options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], answer: 3 }
  ],
  'Social Science': [
    { question: 'Who wrote the Indian Constitution?', options: ['Mahatma Gandhi', 'B.R. Ambedkar', 'Nehru', 'Patel'], answer: 1 },
    { question: 'Which is the longest river in India?', options: ['Yamuna', 'Ganga', 'Godavari', 'Brahmaputra'], answer: 1 },
    { question: 'India got independence in which year?', options: ['1942', '1945', '1947', '1950'], answer: 2 },
    { question: 'What is the capital of India?', options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], answer: 2 },
    { question: 'How many states does India have?', options: ['28', '29', '30', '31'], answer: 0 },
    { question: 'The Indian Constitution came into effect on?', options: ['15 Aug 1947', '26 Jan 1950', '2 Oct 1949', '26 Nov 1949'], answer: 1 }
  ],
  'General': [
    { question: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: 2 },
    { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], answer: 2 },
    { question: 'What is H₂O commonly known as?', options: ['Salt', 'Sugar', 'Water', 'Acid'], answer: 2 },
    { question: 'Who invented the light bulb?', options: ['Newton', 'Edison', 'Tesla', 'Einstein'], answer: 1 },
    { question: 'What is the boiling point of water?', options: ['50°C', '75°C', '100°C', '120°C'], answer: 2 }
  ]
};
