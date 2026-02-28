import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { env } from './env.js';

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection) {
    logger.info('Using existing MongoDB connection');
    return cachedConnection;
  }

  // If there's an active connection in mongoose, reuse it
  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    cachedConnection = conn;
    logger.info('New MongoDB connection established');
    return cachedConnection;
  } catch (error) {
    logger.error('Failed to connect to database', error);
    if (env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};
