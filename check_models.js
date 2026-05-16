require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels in the client, but we can try to use a dummy call or check docs.
    // Actually, let's just try the common ones.
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
    
    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("test");
            console.log(`✅ Model ${m} is available and working.`);
            process.exit(0);
        } catch (e) {
            console.log(`❌ Model ${m} failed: ${e.message}`);
        }
    }
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

listModels();
