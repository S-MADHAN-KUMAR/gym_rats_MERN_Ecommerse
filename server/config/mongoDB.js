import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO;
    if (!mongoURI) {
      throw new Error('Mongo URI is not defined in environment variables.');
    }
    await mongoose.connect(mongoURI);
    console.log('...................DB Connected.....................');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); 
  }
};

export default connectDB;
