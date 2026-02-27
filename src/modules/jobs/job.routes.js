// src/modules/jobs/job.routes.js — Express router for Job endpoints
import { Router } from "express";

const router = Router();

// TODO: Define routes:
//   GET    /           → validate(listJobsQuerySchema) → getAllJobs
//   GET    /:id        → validate(jobIdParamSchema)    → getJobById
//   POST   /           → adminAuth → validate(createJobSchema)  → createJob
//   PATCH  /:id        → adminAuth → validate(updateJobSchema)  → updateJob
//   DELETE /:id        → adminAuth → validate(jobIdParamSchema) → deleteJob

export default router;
