/* Chat Controller - Handles AI Teacher Chat */

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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = `You are a helpful, encouraging, and friendly AI Teacher for 8th-grade students on EduStreamix.
The student is studying Grade ${selectedGrade} (${selectedBoard} board) ${selectedSubject}, specifically on the chapter "${chapter}".
Help them understand the concepts by explaining things simply, using examples that are relatable for 13-14 year olds.
Keep your answer concise (1-3 short paragraphs), clear, and educational.
If they ask about something completely off-topic or inappropriate, politely guide them back to the topic of "${chapter}".`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction
    });

    const formattedHistory = (history || []).map((h) => ({
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

    const fallbacks = [
      `That is a great question. For "${chapter}", focus on the main idea first, then connect each example from the video or textbook back to that idea.`,
      `Good doubt. In Grade ${selectedGrade} ${selectedSubject}, this chapter becomes easier if you write the key terms and one simple example for each term.`,
      `I cannot answer with AI right now, but you can still review the lesson video and try the quiz to check what you understood from "${chapter}".`
    ];

    res.json({ reply: fallbacks[Math.floor(Math.random() * fallbacks.length)] });
  }
};
