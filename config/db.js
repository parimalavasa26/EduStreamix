const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const atlasOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4
};

/**
 * Connects to MongoDB Atlas using the URI provided in environment variables.
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, atlasOptions);

    console.log('MongoDB Atlas Connected Successfully');
    console.log(`Database: ${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB Atlas Connection Error: ${err.message}`);

    if (err.message.includes('Authentication failed')) {
      console.error('TIP: Check your username and password in the .env file.');
    } else if (err.message.includes('querySrv') || err.message.includes('ETIMEOUT') || err.message.includes('ECONNREFUSED')) {
      console.error('TIP: Check your internet connection, DNS, or Atlas network access list.');
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Mongoose will attempt to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB Atlas reconnected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB runtime error: ${err}`);
});

module.exports = connectDB;
