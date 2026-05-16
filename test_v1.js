require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testV1() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Try to get model with explicit version if possible (actually SDK defaults to v1beta for some things)
    // In newer versions, it might default to v1.
    
    // Let's try 'gemini-1.5-flash-latest' which usually works.
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent("hi");
    console.log("✅ Works with default (v1beta)!");
  } catch (e) {
    console.log(`❌ Default failed: ${e.message}`);
    
    try {
        // There isn't a direct way to set apiVersion in the constructor in 0.24.1?
        // Let's check if we can use a different method.
        console.log("Trying with different approach...");
        // Actually, let's try 'gemini-pro' which is v1.
        const genAI2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model2 = genAI2.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });
        const result2 = await model2.generateContent("hi");
        console.log("✅ Works with v1!");
    } catch (e2) {
        console.log(`❌ v1 also failed: ${e2.message}`);
    }
  }
}

testV1();
