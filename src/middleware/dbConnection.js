import { connectDB } from '../config/db.js';
import logger from '../utils/logger.js';

const dbConnectionMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    logger.error('Database connection middleware failed', error);
    res.status(503).json({
      success: false,
      message: 'Service Temporarily Unavailable: Database connection failed',
    });
  }
};

export default dbConnectionMiddleware;
