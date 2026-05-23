import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    process.env.DB_MODE = 'mongo';
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.env.DB_MODE = 'memory';
    console.warn('Falling back to in-memory datastore. Data will reset on restart.');
  }
};

export default connectDB;
