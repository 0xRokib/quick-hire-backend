// src/modules/jobs/job.schema.js — Zod validation schemas for Job
import { z } from "zod";

const CATEGORY_ENUM = [
  "Engineering",
  "Design",
  "Marketing",
  "Finance",
  "Operations",
  "Sales",
  "HR",
  "Legal",
  "Customer Support",
  "Data",
  "Product",
  "Other",
];

const TYPE_ENUM = ["Full-Time", "Part-Time", "Contract", "Internship"];

const salaryRefine = (data) =>
  data.salaryMin === undefined ||
  data.salaryMax === undefined ||
  data.salaryMax >= data.salaryMin;

const createJobBodySchema = z.object({
  title: z.string().trim().min(3).max(100),
  company: z.string().trim().min(2).max(100),
  location: z.string().trim().min(1).max(100),
  category: z.enum(CATEGORY_ENUM),
  type: z.enum(TYPE_ENUM).optional().default("Full-Time"),
  description: z.string().trim().min(20).max(5000),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  currency: z.string().trim().length(3).toUpperCase().optional().default("USD"),
});

const updateJobBodySchema = z.object({
  title: z.string().trim().min(3).max(100).optional(),
  company: z.string().trim().min(2).max(100).optional(),
  location: z.string().trim().min(1).max(100).optional(),
  category: z.enum(CATEGORY_ENUM).optional(),
  type: z.enum(TYPE_ENUM).optional(),
  description: z.string().trim().min(20).max(5000).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  currency: z.string().trim().length(3).toUpperCase().optional(),
});

export const createJobSchema = z.object({
  body: createJobBodySchema.refine(salaryRefine, {
    message: "salaryMax must be >= salaryMin",
    path: ["salaryMax"],
  }),
});

export const updateJobSchema = z.object({
  body: updateJobBodySchema.refine(salaryRefine, {
    message: "salaryMax must be >= salaryMin",
    path: ["salaryMax"],
  }),
});

export const jobIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId"),
  }),
});

export const listJobsQuerySchema = z.object({
  query: z.object({
    q: z.string().trim().optional(),
    category: z.enum(CATEGORY_ENUM).optional(),
    location: z.string().trim().optional(),
    type: z.enum(TYPE_ENUM).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sortBy: z.enum(["createdAt", "title"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
  }),
});
