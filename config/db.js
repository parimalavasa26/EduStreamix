/* ──────────────────────────────────────────────
   MongoDB Connection
   ────────────────────────────────────────────── */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1') || uri === 'undefined') {
      uri = 'mongodb+srv://saisudhasabat10b11407_db_user:Saisudha%402006@cluster0.mhchnju.mongodb.net/syllabus?retryWrites=true&w=majority';
    }
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`⚠️  MongoDB connection failed: ${err.message}`);
    console.error('   The server will continue running but DB features will be limited.');
  }
};

module.exports = connectDB;
