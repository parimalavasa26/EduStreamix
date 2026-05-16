require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Testing connection to:', process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connection Successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.log('TIP: This is likely a DNS or Firewall issue. Try using a different DNS provider (like 8.8.8.8) or check if your network blocks port 27017.');
    }
    process.exit(1);
  }
}

testConnection();
