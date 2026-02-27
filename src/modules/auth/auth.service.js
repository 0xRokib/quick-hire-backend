// src/modules/auth/auth.service.js — Auth business logic
import AppError from '../../utils/AppError.js';
import { signAuthToken } from '../../utils/token.js';
import User from './user.model.js';

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

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

  const token = signAuthToken({ sub: user.id, role: user.role });

  return {
    user: toPublicUser(user),
    token,
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.comparePassword(password)) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signAuthToken({ sub: user.id, role: user.role });

  return {
    user: toPublicUser(user),
    token,
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
