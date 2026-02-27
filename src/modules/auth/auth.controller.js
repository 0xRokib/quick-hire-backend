// src/modules/auth/auth.controller.js — Request/response handlers for Auth
import * as authService from './auth.service.js';
import { successResponse } from '../../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, { statusCode: 201, data: result });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, { statusCode: 200, data: result });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return successResponse(res, { statusCode: 200, data: user });
  } catch (error) {
    return next(error);
  }
};

export const listUsers = async (_req, res, next) => {
  try {
    const users = await authService.listUsers();
    return successResponse(res, { statusCode: 200, data: users });
  } catch (error) {
    return next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const result = await authService.refresh(req.body);
    return successResponse(res, { statusCode: 200, data: result });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    return successResponse(res, {
      statusCode: 200,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return next(error);
  }
};
