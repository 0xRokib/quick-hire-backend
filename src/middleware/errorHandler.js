// src/middleware/errorHandler.js — Central error-handling middleware
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err?.statusCode || err?.status || 500;
  let message = err?.message || 'Internal Server Error';

  if (err?.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  if (err?.name === 'ValidationError') {
    status = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err?.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {}).join(', ') || 'value';
    message = `Duplicate value for field: ${field}`;
  }

  logger.error({ status, message, stack: err?.stack });

  res.status(status).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === 'development' && { stack: err?.stack }),
  });
};

export default errorHandler;
