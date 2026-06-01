require('dotenv').config();
process.env.USE_PUBLIC_DNS = process.env.USE_PUBLIC_DNS || '1';

const connectDB = require('../config/db');

(async () => {
  try {
    console.log('Calling connectDB() from test harness');
    await connectDB();
    console.log('connectDB() returned; check logs for DNS diagnostics.');
    process.exit(0);
  } catch (err) {
    console.error('connectDB() threw:', err);
    process.exit(1);
  }
})();
