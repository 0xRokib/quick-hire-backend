// src/modules/auth/auth.service.js — Auth business logic
import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import AppError from '../../utils/AppError.js';
import { parseExpiresIn, signAuthToken, verifyAuthToken } from '../../utils/token.js';
import User from './user.model.js';

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const hashRefreshToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const tokensEqual = (leftToken, rightToken) => {
  const left = Buffer.from(leftToken, 'utf8');
  const right = Buffer.from(rightToken, 'utf8');

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
};

const buildTokenPayload = (user) => ({ sub: user.id, role: user.role });

const buildAuthTokens = async (user) => {
  const accessToken = signAuthToken(buildTokenPayload(user), {
    tokenType: 'access',
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
  const refreshToken = signAuthToken(buildTokenPayload(user), {
    tokenType: 'refresh',
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  const refreshTokenHash = hashRefreshToken(refreshToken);
  const refreshTokenExpiresAt = new Date(
    Date.now() + parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN) * 1000,
  );

  await User.findByIdAndUpdate(user.id, {
    $set: {
      refreshTokenHash,
      refreshTokenExpiresAt,
    },
  });

  return { accessToken, refreshToken };
};

const clearLoginFailures = async (user) => {
  if (!user.loginFailures && !user.lockUntil) {
    return;
  }

  await User.findByIdAndUpdate(user.id, {
    $set: { loginFailures: 0 },
    $unset: { lockUntil: 1 },
  });
};

const registerFailedLogin = async (user) => {
  const failedAttempts = (user.loginFailures || 0) + 1;
  const shouldLock = failedAttempts >= env.AUTH_ACCOUNT_MAX_FAILURES;

  if (shouldLock) {
    await User.findByIdAndUpdate(user.id, {
      $set: {
        loginFailures: 0,
        lockUntil: new Date(Date.now() + env.AUTH_ACCOUNT_LOCK_MS),
      },
    });
    return;
  }

  await User.findByIdAndUpdate(user.id, {
    $set: { loginFailures: failedAttempts },
    $unset: { lockUntil: 1 },
  });
};

export const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const totalUsers = await User.estimatedDocumentCount();
  const wantsAdmin = role === 'admin';

  if (wantsAdmin && totalUsers > 0) {
    throw new AppError('Admin self-registration is disabled', 403);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: wantsAdmin ? 'admin' : 'user',
  });

  const tokens = await buildAuthTokens(user);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +loginFailures +lockUntil');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    throw new AppError('Account temporarily locked due to failed logins. Try again later.', 423);
  }

  if (!user.comparePassword(password)) {
    await registerFailedLogin(user);
    throw new AppError('Invalid email or password', 401);
  }

  await clearLoginFailures(user);
  const tokens = await buildAuthTokens(user);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return toPublicUser(user);
};

export const listUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(toPublicUser);
};

export const refresh = async ({ refreshToken }) => {
  const payload = verifyAuthToken(refreshToken);
  if (payload.typ !== 'refresh' || !payload.sub) {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash +refreshTokenExpiresAt');
  if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
    throw new AppError('Invalid refresh token', 401);
  }

  if (user.refreshTokenExpiresAt.getTime() <= Date.now()) {
    throw new AppError('Refresh token has expired. Please log in again.', 401);
  }

  const incomingHash = hashRefreshToken(refreshToken);
  if (!tokensEqual(incomingHash, user.refreshTokenHash)) {
    throw new AppError('Invalid refresh token', 401);
  }

  const tokens = await buildAuthTokens(user);
  return {
    user: toPublicUser(user),
    ...tokens,
  };
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshTokenHash: 1, refreshTokenExpiresAt: 1 },
  });
};
