const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caresure';

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    cached.promise = mongoose.connect(mongoURI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    }).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB Atlas');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;
