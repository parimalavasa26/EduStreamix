/* ──────────────────────────────────────────────
   EduStreamX — Server Entry Point
   ────────────────────────────────────────────── */

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const studyRoutes = require('./routes/studyRoutes');

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

// ── Routes ──────────────────────────────────
app.use('/', studyRoutes);

// ── 404 Handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).render('landing', { error: 'Page not found' });
});

// ── Global Error Handler ────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🚀 EduStreamix is running at http://localhost:${PORT}\n`);
});

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
