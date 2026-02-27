// src/modules/auth/user.model.js — Mongoose schema & model for User
import mongoose from 'mongoose';
import { hashPassword, verifyPassword } from '../../utils/password.js';

export const USER_ROLES = ['user', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
      index: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', function hashUserPassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = hashPassword(this.password);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return verifyPassword(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
