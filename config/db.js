/* ──────────────────────────────────────────────
   MongoDB Connection Utility
   ────────────────────────────────────────────── */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using the URI provided in environment variables.
 * Includes robust error handling and event listeners for production stability.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Optional: Log database name to confirm connection
    console.log(`📂 Database: ${conn.connection.name}\n`);

  } catch (err) {
    console.error(`\n❌ MongoDB Connection Error: ${err.message}`);
    
    // Detailed troubleshooting for beginners
    if (err.message.includes('Authentication failed')) {
      console.error('👉 TIP: Check your username and password in the .env file.');
    } else if (err.message.includes('queryTxt ETIMEOUT')) {
      console.error('👉 TIP: Check your internet connection or IP whitelisting in Atlas.');
    }

    // In production, you might want to retry or exit
    // process.exit(1); 
  }
};

// Handle connection events for better monitoring
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`🛑 MongoDB runtime error: ${err}`);
});

module.exports = connectDB;
