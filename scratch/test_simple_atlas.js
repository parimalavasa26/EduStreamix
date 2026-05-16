const mongoose = require('mongoose');

const uri = 'mongodb://admin:dCAhzmzhPiTjmdfa@ac-5gzeje0-shard-00-00.ixuccs7.mongodb.net:27017/edustreamix?ssl=true&authSource=admin';

async function testSimple() {
  console.log('Testing simple connection...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Simple Connection Successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Simple Connection Failed:', err.message);
    process.exit(1);
  }
}

testSimple();
