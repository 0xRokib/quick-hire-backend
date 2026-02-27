// src/utils/token.js — HMAC-signed token helpers
import crypto from 'node:crypto';
import { env } from '../config/env.js';
import AppError from './AppError.js';

const EXPIRES_IN_PATTERN = /^(\d+)([smhd])?$/i;
const UNIT_TO_SECONDS = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
};

const base64UrlEncode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const base64UrlDecode = (value) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));

const createSignature = (value) =>
  crypto.createHmac('sha256', env.JWT_SECRET).update(value).digest('base64url');

const parseExpiresIn = (value) => {
  const matched = EXPIRES_IN_PATTERN.exec(value);
  if (!matched) {
    throw new AppError('Invalid JWT_EXPIRES_IN format in environment', 500);
  }

  const amount = Number(matched[1]);
  const unit = (matched[2] || 's').toLowerCase();
  const multiplier = UNIT_TO_SECONDS[unit];

  return amount * multiplier;
};

export const signAuthToken = (payload) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseExpiresIn(env.JWT_EXPIRES_IN);

  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const body = base64UrlEncode({ ...payload, iat: now, exp });
  const unsignedToken = `${header}.${body}`;
  const signature = createSignature(unsignedToken);

  return `${unsignedToken}.${signature}`;
};

export const verifyAuthToken = (token) => {
  if (!token) {
    throw new AppError('Authentication token is required', 401);
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new AppError('Invalid authentication token', 401);
  }

  const [header, body, signature] = parts;
  const unsignedToken = `${header}.${body}`;
  const expectedSignature = createSignature(unsignedToken);
  const signatureBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (signatureBuffer.length !== expectedBuffer.length) {
    throw new AppError('Invalid authentication token', 401);
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    throw new AppError('Invalid authentication token', 401);
  }

  let payload;
  try {
    payload = base64UrlDecode(body);
  } catch {
    throw new AppError('Invalid authentication token payload', 401);
  }

  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new AppError('Authentication token has expired', 401);
  }

  return payload;
};
