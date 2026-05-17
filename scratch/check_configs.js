const mongoose = require('mongoose');
require('dotenv').config();

async function checkConfigs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const docs = await mongoose.connection.db.collection('configs').find({}).toArray();
    console.log('Configs:', JSON.stringify(docs, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkConfigs();
