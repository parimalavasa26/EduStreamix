const { GoogleGenerativeAI } = require('@google/generative-ai');
const SSC_Syllabus = require('../models/Ssc9');
const CBSE_Syllabus = require('../models/Cbse9');
const ISC_Syllabus = require('../models/Icse9');

const FALLBACK_QUIZZES = {
  "Mathematics": [
    { "question": "What is the value of (a+b)²?", "options": ["a²+b²", "a²+2ab+b²", "a²-2ab+b²", "a²-b²"], "correctAnswerIndex": 1, "explanation": "The square of a binomial (a+b) is given by the identity a² + 2ab + b²." },
    { "question": "If x + 5 = 12, what is the value of x?", "options": ["5", "7", "12", "17"], "correctAnswerIndex": 1, "explanation": "Subtracting 5 from both sides gives x = 12 - 5 = 7." },
    { "question": "What is the area of a circle with radius r?", "options": ["2πr", "πr²", "πd", "2πr²"], "correctAnswerIndex": 1, "explanation": "The standard formula for the area of a circle is π times the square of the radius." }
  ],
  "Science": [
    { "question": "What is the SI unit of Force?", "options": ["Joule", "Pascal", "Newton", "Watt"], "correctAnswerIndex": 2, "explanation": "Force is measured in Newtons (N) in the International System of Units." },
    { "question": "Which gas is most abundant in Earth's atmosphere?", "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], "correctAnswerIndex": 2, "explanation": "Nitrogen makes up approximately 78% of the Earth's atmosphere." },
    { "question": "What is the chemical symbol for Water?", "options": ["H2O", "CO2", "O2", "HO2"], "correctAnswerIndex": 0, "explanation": "Water is composed of two hydrogen atoms and one oxygen atom (H₂O)." }
  ],
  "General": [
    { "question": "This is a sample question for your chosen topic. (AI Service is currently offline)", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswerIndex": 0, "explanation": "This is a fallback question provided because the AI service is currently unavailable or the API key is invalid." },
    { "question": "Which of these is a prime number?", "options": ["4", "6", "8", "7"], "correctAnswerIndex": 3, "explanation": "7 is only divisible by 1 and itself, making it a prime number." }
  ]
};

// Helper: strip markdown code fences from AI output
function stripCodeFences(text) {
    if (text.startsWith('```json')) {
        text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
        text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return text;
}

// ===== MCQ TEST GENERATION =====
exports.generateTest = async (req, res) => {
    const {
        board,
        grade,
        subject,
        focusTopic,
        difficulty,
        numQuestions
    } = req.body;

    const actualBoard = (board === "SSC" ? "Telangana SSC" : board || "CBSE").toUpperCase();

    try {
        // Validation
        if (!board || !grade || !subject || !focusTopic) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY')) {
            throw new Error('API_KEY_MISSING');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
You are an expert educational MCQ test generator for the Indian education system.

Create a multiple-choice question (MCQ) test based on:
- Board: ${actualBoard}
- Grade: ${grade}
- Subject: ${subject}
- Topic: ${focusTopic}
- Difficulty: ${difficulty || 'medium'}
- Number of Questions: ${numQuestions || 5}

Return ONLY valid JSON. No markdown. No backticks.
{
  "avgTimeSeconds": 300,
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Explanation here"
    }
  ]
}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        let jsonText = stripCodeFences(text);
        const parsed = JSON.parse(jsonText);

        return res.status(200).json({
            avgTimeSeconds: parsed.avgTimeSeconds || ((numQuestions || 5) * 60),
            questions: parsed.questions || []
        });

    } catch (err) {
        console.error("Quiz generation error:", err.message);
        
        // FALLBACK LOGIC
        const fallbackPool = FALLBACK_QUIZZES[subject] || FALLBACK_QUIZZES["General"];
        const selectedQuestions = [...fallbackPool]
            .sort(() => 0.5 - Math.random())
            .slice(0, numQuestions || 5);

        return res.status(200).json({
            grade,
            board: actualBoard,
            subject,
            chapter: `(Demo) ${focusTopic}`,
            avgTimeSeconds: (numQuestions || 5) * 60,
            questions: selectedQuestions,
            isFallback: true,
            errorInfo: err.message.includes('API_KEY_INVALID') || err.message.includes('API key not valid') 
                ? 'Invalid API Key' 
                : err.message === 'API_KEY_MISSING' ? 'Missing API Key' : 'AI Service Unavailable'
        });
    }
};

exports.getStudy = async (req, res) => {
    let grade = req.query.grade;
    let board = req.query.board;

    try {
        let syllabus = null;
        if (board === 'SSC') {
            syllabus = await SSC_Syllabus.find({ grade: grade });
        } else if (board === 'CBSE') {
            syllabus = await CBSE_Syllabus.find({ grade: grade });
        } else if (board === 'ISC' || board === 'ICSE') {
            syllabus = await ISC_Syllabus.find({ grade: grade });
        }

        if (syllabus) {
            res.render('study', {
                studyGrade: grade,
                studyBoard: board,
                studySyllabus: syllabus
            });
        } else {
            res.status(404).send("Syllabus not found");
        }
    } catch (err) {
        console.error("Error fetching syllabus:", err);
        res.status(500).send("Internal Server Error");
    }
};
