const axios = require('axios');

// ─────────────────────────────
// CONFIG
// ─────────────────────────────

// Based on diagnostic check, these are the models available for your API key:
const PRIMARY_MODEL = 'gemini-2.0-flash'; 
const FALLBACK_MODEL = 'gemini-2.5-flash';
const API_VERSION = 'v1';

/**
 * Robust JSON extraction to handle AI noise and markdown fences.
 */
function extractJSON(text) {
  if (!text) return null;
  try {
    let cleaned = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        return JSON.parse(cleaned.substring(start, end + 1));
      }
      throw e;
    }
  } catch (err) {
    return null;
  }
}

/**
 * Strict Prompt Builder for Production-Ready Syllabus MCQs.
 */
function buildPrompt(data) {
  return `Generate exactly ${data.numQuestions || 10} high-quality, syllabus-accurate MCQs for ${data.board} Grade ${data.grade} ${data.subject} Topic: ${data.focusTopic}.

STRICT SYSTEM RULES:
1. FOCUS: Generate actual problems, numericals, and direct conceptual questions related to ${data.focusTopic}.
2. NO META: Do NOT ask questions about the syllabus structure or importance.
3. NO REVIEWS: Do NOT generate "Syllabus review" questions or generic templates.
4. EXACT TOPIC: All questions must be directly about ${data.focusTopic}.
5. FORMAT: Each item must have: question, 4 options, correctAnswerIndex (0-3), and a concise explanation.

OUTPUT FORMAT (JSON ONLY):
{
  "avgTimeSeconds": 600,
  "questions": [
    {
      "question": "Clear problem statement",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Brief reasoning"
    }
  ]
}

Return ONLY the JSON object. No markdown code blocks. No backticks. No intro/outro text.`;
}

/**
 * Helper to call Gemini API via Axios for precise endpoint control (v1)
 */
async function callGemini(model, prompt) {
  const url = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const response = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.data && response.data.candidates && response.data.candidates[0].content) {
    return response.data.candidates[0].content.parts[0].text;
  }
  throw new Error("Invalid response structure from Gemini API");
}

/**
 * Main Controller: Fresh Generation via Gemini (No Caching)
 */
exports.generateTest = async (req, res) => {
  const { focusTopic } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Configuration Error", message: "API Key is missing." });
  }

  console.log(`\n=== AI QUIZ REQUEST: ${focusTopic} (Gemini 2.x Mode) ===`);

  try {
    const prompt = buildPrompt(req.body);
    let quizData = null;
    let lastError = null;

    // 1. Primary Attempt (gemini-2.0-flash)
    try {
      console.log(`>> Attempting with Primary Model: ${PRIMARY_MODEL}...`);
      const text = await callGemini(PRIMARY_MODEL, prompt);
      quizData = extractJSON(text);
    } catch (err) {
      console.warn(`>> Primary model failed: ${err.message}`);
      lastError = err;
    }

    // 2. Fallback Attempt (gemini-2.5-flash)
    if (!quizData) {
      try {
        console.log(`>> Attempting with Fallback Model: ${FALLBACK_MODEL}...`);
        const text = await callGemini(FALLBACK_MODEL, prompt);
        quizData = extractJSON(text);
      } catch (err) {
        console.error(`>> Fallback model failed: ${err.message}`);
        lastError = err;
      }
    }

    if (!quizData) {
      throw new Error(lastError ? lastError.message : "All AI generation attempts failed.");
    }

    console.log(`>> Successfully generated ${quizData.questions.length} MCQs.`);
    return res.json(quizData);

  } catch (err) {
    console.error("!!! AI GENERATION ERROR !!!", err.message);
    return res.status(500).json({
      error: "Service Temporarily Unavailable",
      message: "The AI engine encountered an issue. Please verify your API key and model access.",
      details: err.message
    });
  }
};
