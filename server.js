/* ──────────────────────────────────────────────
   EduStreamix — Server Entry Point
   ────────────────────────────────────────────── */

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const studyRoutes    = require('./routes/studyRoutes');
const videoRoutes    = require('./routes/videoRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes');
const progressRoutes = require('./routes/progressRoutes');

// ── Global Error Protection ─────────────────
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

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
app.use('/', videoRoutes);
app.use('/', syllabusRoutes);
app.use('/', progressRoutes);

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
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n🚀 EduStreamix is running at http://localhost:${port}\n`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️  Port ${port} is in use.`);
      if (port < PORT + 5) { // Try up to 5 ports
        console.log(`   Trying next port: ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('❌ Could not find an open port. Please close other applications.');
        process.exit(1);
      }
    } else {
      console.error("❌ Server Error:", err);
    }
  });
};

startServer(PORT);
