require('dotenv').config();

// ── Environment Validation ──────────────────
if (!process.env.GEMINI_API_KEY) {
  console.error('\n❌ CRITICAL ERROR: Missing GEMINI_API_KEY in .env');
  console.error('Please add your Gemini API Key to the .env file and restart the server.\n');
  process.exit(1);
}

console.log("✅ GEMINI_API_KEY validated successfully.");

/* ──────────────────────────────────────────────
    EduStreamix — Server Entry Point
────────────────────────────────────────────── */

const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
const studyRoutes = require('./routes/studyRoutes');
const videoRoutes = require('./routes/videoRoutes');
const quizRoutes = require('./routes/quizRoutes');

// ── Global Error Protection ─────────────────
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

const app = express();
const PORT = process.env.PORT || 3000;

// ── Connect to MongoDB ──────────────────────
connectDB();

// ── Middleware ───────────────────────────────
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// ── Home Route ──────────────────────────────
app.get('/', (req, res) => {
  res.render('landing');
});

// ── Routes ──────────────────────────────────
app.use('/', studyRoutes);
app.use('/', videoRoutes);
app.use('/api/quiz', quizRoutes);

// ── 404 Handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).render('landing', {
    error: 'Page not found'
  });
});

// ── Global Error Handler ────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);

  res.status(500).json({
    error: 'Internal server error'
  });
});

// ── Start Server ────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🚀 EduStreamix is running at http://localhost:${PORT}\n`);
});

// ── Server Error Handling ───────────────────
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Trying port ${PORT + 1}...`);

    app.listen(PORT + 1, () => {
      console.log(`\n🚀 EduStreamix is running at http://localhost:${PORT + 1}\n`);
    });
  } else {
    console.error("Server Error:", err);
  }
});