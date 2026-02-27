// src/modules/auth/auth.routes.js — Express router for Auth endpoints
import { Router } from 'express';
import validate from '../../middleware/validate.js';
import { authorize, protect } from '../../middleware/auth.js';
import * as authController from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);
router.get('/users', protect, authorize('admin'), authController.listUsers);

export default router;
