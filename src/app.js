// src/app.js — Express app factory (no listen)
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import applicationsRouter, { jobApplicationsRouter } from './modules/applications/index.js';
import authRouter from './modules/auth/index.js';
import jobsRouter from './modules/jobs/index.js';
import { morganStream } from './utils/logger.js';

// Initialize DB connection (async, will reconnect as needed)
connectDB();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? env.ALLOWED_ORIGIN : '*',
  }),
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: morganStream }));
} else {
  app.use(morgan('dev'));
}

const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please slow down.' },
});

// if (env.NODE_ENV === 'production') {
//   app.use(apiLimiter);
// }

const healthRouter = express.Router();

healthRouter.get('/', (_req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    status: 'ok',
    db: dbState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/applications', applicationsRouter);
app.use('/api/v1', jobApplicationsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/health', healthRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
