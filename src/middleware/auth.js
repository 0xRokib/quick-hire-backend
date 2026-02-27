// src/middleware/auth.js — Authentication and role-based authorization
import AppError from '../utils/AppError.js';
import { verifyAuthToken } from '../utils/token.js';
import User from '../modules/auth/user.model.js';

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization header with Bearer token is required', 401);
    }

    const token = authHeader.slice(7).trim();
    const payload = verifyAuthToken(token);
    if (!payload.sub) {
      throw new AppError('Invalid authentication token payload', 401);
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      throw new AppError('User for this token no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    next(new AppError('Authentication required', 401));
    return;
  }

  if (!roles.includes(req.user.role)) {
    next(new AppError('Forbidden: insufficient permissions', 403));
    return;
  }

  next();
};
