// src/modules/applications/application.routes.js — Express routers for Application endpoints
import { Router } from "express";
import rateLimit from "express-rate-limit";
import adminAuth from "../../middleware/adminAuth.js";
import validate from "../../middleware/validate.js";
import * as applicationController from "./application.controller.js";
import {
  applicationIdParamSchema,
  applicationsByJobParamSchema,
  createApplicationSchema,
  listApplicationsQuerySchema,
  updateApplicationStatusSchema,
} from "./application.schema.js";

const applicationsRouter = Router();
const jobApplicationsRouter = Router();

const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many applications submitted. Try again later.",
  },
});

applicationsRouter.post(
  "/",
  applyLimiter,
  validate(createApplicationSchema),
  applicationController.createApplication,
);
applicationsRouter.get(
  "/",
  adminAuth,
  validate(listApplicationsQuerySchema),
  applicationController.getAllApplications,
);
applicationsRouter.get(
  "/:id",
  adminAuth,
  validate(applicationIdParamSchema),
  applicationController.getApplicationById,
);
applicationsRouter.patch(
  "/:id/status",
  adminAuth,
  validate(updateApplicationStatusSchema),
  applicationController.updateApplicationStatus,
);

jobApplicationsRouter.get(
  "/jobs/:id/applications",
  adminAuth,
  validate(applicationsByJobParamSchema),
  applicationController.getApplicationsByJobId,
);

export { jobApplicationsRouter };
export default applicationsRouter;
