require('dotenv').config();

// ── Environment Validation ──────────────────
if (!process.env.GEMINI_API_KEY) {
  console.error('\n❌ CRITICAL ERROR: Missing GEMINI_API_KEY in .env');
  console.error('Please add your Gemini API Key to the .env file and restart the server.\n');
  process.exit(1);
}

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || !process.env.SECRET_TOKEN) {
  console.error('\n❌ CRITICAL ERROR: Missing Razorpay / JWT configuration in .env');
  console.error('Please add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and SECRET_TOKEN to the .env file and restart the server.\n');
  process.exit(1);
}

console.log("✅ GEMINI_API_KEY validated successfully.");
console.log("✅ Razorpay and JWT configuration validated successfully.");

/* ──────────────────────────────────────────────
    EduStreamix — Server Entry Point
────────────────────────────────────────────── */

const express = require('express');
const path = require('path');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY SECRET: [REDACTED]");

// ── Connect to MongoDB ──────────────────────
connectDB();

// ── Middleware ───────────────────────────────
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/!payment', (req, res) => {
  return res.render('!payment');
});

app.get('/payment', (req, res) => {
  return res.redirect('/!payment');
});

app.post('/create-order', async (req, res) => {

    try {

        console.log("Creating Razorpay order...");

        const options = {
            amount: 1000,
            currency: 'INR',
            receipt: 'EduStreamix_' + Date.now()
        };

        const order = await razorpay.orders.create(options);

        console.log('ORDER CREATED:', order);

        res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {

        console.error('RAZORPAY AUTH ERROR:', error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/verify-payment', (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    const token = jwt.sign(
      {
        premium: true
      },
      process.env.SECRET_TOKEN,
      {
        expiresIn: '30d'
      }
    );

    res.cookie('session_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Payment Verified & Access Granted'
    });
  }

  return res.status(400).json({
    success: false,
    message: 'Invalid Signature'
  });
});

app.use((req, res, next) => {
  const openPaths = [
    '/!payment',
    '/payment',
    '/create-order',
    '/verify-payment',
    '/favicon.ico'
  ];

  if (
    openPaths.includes(req.path) ||
    req.path.startsWith('/css/') ||
    req.path.startsWith('/js/') ||
    req.path.startsWith('/uploads/') ||
    req.path.startsWith('/images/')
  ) {
    return next();
  }

  const token = req.cookies.session_token;
  if (!token) {
    if (req.accepts('html')) {
      return res.render('!payment');
    }
    return res.status(401).json({
      success: false,
      message: 'Payment required'
    });
  }

  try {
    jwt.verify(token, process.env.SECRET_TOKEN);
    return next();
  } catch (error) {
    console.log('TOKEN INVALID', error?.message || error);
    if (req.accepts('html')) {
      return res.render('!payment');
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid session token'
    });
  }
});

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
// ── Start Server ────────────────────────────
const DEFAULT_PORT = 30002;

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${port} is in use. Trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error("Server Error:", err);
        }
    });
}

startServer(DEFAULT_PORT);