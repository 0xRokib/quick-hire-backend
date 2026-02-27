// src/utils/logger.js — Winston logger instance
import fs from "fs";
import path from "path";
import winston from "winston";
import { env } from "../config/env.js";

const transports = [];

if (env.NODE_ENV === "production") {
  const logsDir = path.resolve("logs");
  fs.mkdirSync(logsDir, { recursive: true });
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "app.log"),
    }),
  );
} else {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
});

export default logger;
