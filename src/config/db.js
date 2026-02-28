import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', error);
    if (env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};
