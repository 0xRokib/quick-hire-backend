// src/modules/applications/application.schema.js — Zod validation schemas for Application
import { z } from 'zod';

const STATUS_ENUM = ['Pending', 'Reviewed', 'Rejected', 'Hired'];
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId');

export const createApplicationSchema = z.object({
  body: z.object({
    job: objectIdSchema,
    name: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(120, 'Name cannot exceed 120 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email address')
      .toLowerCase(),
    resumeLink: z
      .string({ required_error: 'Resume link is required' })
      .url('Resume link must be a valid http/https URL')
      .refine((value) => /^https?:\/\//i.test(value), {
        message: 'Resume link must start with http:// or https://',
      }),
    coverNote: z.string().trim().max(2000, 'Cover note cannot exceed 2000 characters').optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    status: z.enum(STATUS_ENUM),
  }),
});

export const applicationIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const listApplicationsQuerySchema = z.object({
  query: z.object({
    job: objectIdSchema.optional(),
    status: z.enum(STATUS_ENUM).optional(),
    email: z.string().trim().email().toLowerCase().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const applicationsByJobParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
