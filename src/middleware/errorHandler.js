// src/middleware/errorHandler.js — Central error-handling middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err?.statusCode || err?.status || 500;
  const message = err?.message || "Internal Server Error";

  res.status(status).json({ message });
};

export default errorHandler;
