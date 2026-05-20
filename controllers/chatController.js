/* ──────────────────────────────────────────────
   Chat Controller — Handles AI Teacher Chat
   ────────────────────────────────────────────── */

const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handleChat = async (req, res) => {
  const { grade, board, subject, chapter, message, history } = req.body;

  if (!message || !chapter) {
    return res.status(400).json({ error: 'Message and chapter are required.' });
  }

  const selectedGrade = grade || '8';
  const selectedBoard = board || 'CBSE';
  const selectedSubject = subject || 'Science';

  try {
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY') || apiKey === 'undefined' || apiKey.length < 10) {
      apiKey = 'AIzaSyDoj644WpfTgz224pTMXwcsks8sEhWU28k'; // Fallback key
    }

    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = `You are a helpful, encouraging, and friendly AI Teacher for 8th-grade students on EduStreamix.
The student is studying Grade ${selectedGrade} (${selectedBoard} board) ${selectedSubject}, specifically on the chapter "${chapter}".
Help them understand the concepts by explaining things simply, using examples that are relatable for 13-14 year olds.
Keep your answer concise (1-3 short paragraphs), clear, and educational.
If they ask about something completely off-topic or inappropriate, politely guide them back to the topic of "${chapter}".`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction
    });

    // Map history to the format expected by Gemini SDK
    const formattedHistory = (history || []).map(h => ({
      role: h.role === 'bot' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7
      }
    });

    const result = await chat.sendMessage(message);
    const replyText = result.response.text();

    res.json({ reply: replyText });
  } catch (err) {
    console.error('AI Chatbot error:', err.message);

    // Friendly fallbacks if API is offline
    const FALLBACKS = [
      `That is a great question! Regarding this topic in "${chapter}", it is very important to understand how these concepts build on top of each other. Try reading the textbook explanation or watching the video to see a visual breakdown!`,
      `Interesting doubt! For Grade ${selectedGrade} ${selectedSubject}, the key terms in this chapter are fundamental. Make sure to take down notes on these concepts and review them before the quiz!`,
      `I'm currently running in offline mode, but I encourage you to check out the quiz for this chapter to test your knowledge, or discuss this question with your classmates and teachers!`
    ];
    const fallbackReply = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];

    res.json({ reply: fallbackReply });
  }
};
