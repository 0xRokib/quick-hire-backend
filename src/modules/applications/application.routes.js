// src/modules/applications/application.routes.js — Express router for Application endpoints
import { Router } from "express";

const router = Router();

// TODO: Define routes:
//   POST   /                        → validate(createApplicationSchema)               → createApplication
//   GET    /                        → adminAuth → getAllApplications
//   GET    /:id                     → adminAuth → validate(applicationIdParamSchema)   → getApplicationById
//   PATCH  /:id/status              → adminAuth → validate(updateApplicationStatusSchema) → updateApplicationStatus
// NOTE: GET /api/v1/jobs/:id/applications is mounted in job routes or app.js

export default router;
