const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/edustreamix';

async function testLocal() {
  console.log('Testing local connection to:', uri);
  try {
    await mongoose.connect(uri);
    console.log('✅ Local Connection Successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Local Connection Failed:', err.message);
    process.exit(1);
  }
}

testLocal();
