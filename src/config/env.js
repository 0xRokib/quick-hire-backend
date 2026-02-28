// src/config/env.js — Zod-parsed & validated environment variables
import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  MONGO_URI: z.string().min(1),
  ALLOWED_ORIGIN: z.string().min(1), // Can be a comma-separated list of URLs
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive(),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  AUTH_LOGIN_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  AUTH_LOGIN_MAX_REQUESTS: z.coerce.number().int().positive().default(20),
  AUTH_ACCOUNT_MAX_FAILURES: z.coerce.number().int().positive().default(5),
  AUTH_ACCOUNT_LOCK_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']),
});
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment validation failed:');
  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
