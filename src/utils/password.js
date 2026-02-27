// src/utils/password.js — Password hashing helpers
import crypto from 'node:crypto';

const KEY_LENGTH = 64;

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, KEY_LENGTH);
  const keyBuffer = Buffer.from(key, 'hex');

  if (keyBuffer.length !== derived.length) {
    return false;
  }

  return crypto.timingSafeEqual(keyBuffer, derived);
};
