// src/modules/auth/auth.routes.js — Express router for Auth endpoints
import { Router } from 'express';
// import rateLimit from 'express-rate-limit';
import { authorize, protect } from '../../middleware/auth.js';
import validate from '../../middleware/validate.js';
import * as authController from './auth.controller.js';
import { loginSchema, refreshTokenSchema, registerSchema } from './auth.schema.js';

const router = Router();
/*
const loginLimiter = rateLimit({
  windowMs: env.AUTH_LOGIN_WINDOW_MS,
  limit: env.AUTH_LOGIN_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts from this IP. Please try again later.',
  },
});
*/

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.get('/users', protect, authorize('admin'), authController.listUsers);

export default router;
