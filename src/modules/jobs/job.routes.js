// src/modules/jobs/job.routes.js — Express router for Job endpoints
import { Router } from "express";
import adminAuth from "../../middleware/adminAuth.js";
import validate from "../../middleware/validate.js";
import * as jobController from "./job.controller.js";
import {
  createJobSchema,
  jobIdParamSchema,
  listJobsQuerySchema,
  updateJobSchema,
} from "./job.schema.js";

const router = Router();

router.get("/", validate(listJobsQuerySchema), jobController.getAllJobs);
router.get("/:id", validate(jobIdParamSchema), jobController.getJobById);
router.post("/", adminAuth, validate(createJobSchema), jobController.createJob);
router.patch(
  "/:id",
  adminAuth,
  validate(jobIdParamSchema),
  validate(updateJobSchema),
  jobController.updateJob,
);
router.delete("/:id", adminAuth, validate(jobIdParamSchema), jobController.deleteJob);

export default router;
