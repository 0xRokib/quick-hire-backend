// server.js — Entry point: imports the Express app and starts listening
import app from './src/app.js';
import { env } from './src/config/env.js';
import logger from './src/utils/logger.js';

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
