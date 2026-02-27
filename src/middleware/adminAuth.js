// src/middleware/adminAuth.js — Backward-compatible admin guard
import { authorize, protect } from './auth.js';

const ensureAdmin = (req, res, next) => {
  protect(req, res, (error) => {
    if (error) {
      next(error);
      return;
    }

    authorize('admin')(req, res, next);
  });
};

export default ensureAdmin;
