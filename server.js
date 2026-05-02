/* ──────────────────────────────────────────────
   EduStreamX — Server Entry Point
   ────────────────────────────────────────────── */

require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const studyRoutes = require('./routes/studyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Connect to MongoDB ──────────────────────
connectDB();

// ── Middleware ───────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.listen(PORT, () => {
  console.log(`\n🚀 EduStreamix is running at http://localhost:${PORT}\n`);
});
