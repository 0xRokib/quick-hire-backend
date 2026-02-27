# QuickHire — Backend Technical Requirements Specification

> **Stack:** Express.js · MongoDB / Mongoose · RESTful API · Industry Standard
> **Version:** 1.0.0 | **Status:** Draft

---

## Table of Contents

1. [Project Overview & Goals](#1-project-overview--goals)
2. [Technology Stack](#2-technology-stack)
3. [Folder Structure](#3-folder-structure)
4. [Environment Configuration](#4-environment-configuration)
5. [Database Design & Mongoose Models](#5-database-design--mongoose-models)
6. [API Endpoints Specification](#6-api-endpoints-specification)
7. [Middleware Architecture](#7-middleware-architecture)
8. [Validation Layer](#8-validation-layer)
9. [Error Handling Strategy](#9-error-handling-strategy)
10. [Security Requirements](#10-security-requirements)
11. [Logging & Monitoring](#11-logging--monitoring)
12. [Testing Requirements](#12-testing-requirements)
13. [Git Workflow & Commit Standards](#13-git-workflow--commit-standards)
14. [README Requirements](#14-readme-requirements)
15. [Deployment Checklist](#15-deployment-checklist)

---

## 1. Project Overview & Goals

QuickHire is a mini job board platform. The backend is a RESTful API server responsible for managing job listings, accepting candidate applications, and exposing a clean, well-validated JSON interface to the frontend.

### Objectives

- Provide a production-grade Express.js REST API following MVC / layered-architecture conventions.
- Persist all data in MongoDB via Mongoose with strongly typed schemas and model-level validation.
- Implement comprehensive input validation, centralised error handling, and structured JSON responses.
- Deliver secure, documented, and easily deployable code with a meaningful Git history.

---

## 2. Technology Stack

| Category    | Technology                               | Version / Notes     |
| ----------- | ---------------------------------------- | ------------------- |
| Runtime     | Node.js                                  | >= 18 LTS           |
| Framework   | Express.js                               | ^4.18               |
| Database    | MongoDB Atlas / Local                    | ^7.0                |
| ODM         | Mongoose                                 | ^8.x                |
| Validation  | Zod                                      | ^3.x                |
| Environment | dotenv                                   | ^16.x               |
| Logging     | morgan + winston                         | ^1.x / ^3.x         |
| Security    | helmet + cors + express-rate-limit       | latest              |
| Testing     | Jest + Supertest + mongodb-memory-server | ^29.x / ^6.x / ^9.x |
| Dev tooling | nodemon + eslint + prettier              | latest              |

---

## 3. Folder Structure

Use a **feature-first modular architecture**. Each feature (module) is fully self-contained — its routes, controller, service, schema, and Zod validators all live together. Shared infrastructure (config, middleware, utils) sits at the top level.

```
quickhire-backend/
├── src/
│   ├── config/
│   │   ├── db.js                    # Mongoose connection factory
│   │   └── env.js                   # Zod-parsed & validated env vars
│   │
│   ├── modules/                     # ← Feature-first modular structure
│   │   ├── jobs/
│   │   │   ├── job.model.js         # Mongoose schema & model
│   │   │   ├── job.schema.js        # Zod validation schemas
│   │   │   ├── job.service.js       # DB queries & business logic
│   │   │   ├── job.controller.js    # Request/response handling
│   │   │   ├── job.routes.js        # Express router
│   │   │   └── index.js             # Module barrel export
│   │   │
│   │   └── applications/
│   │       ├── application.model.js
│   │       ├── application.schema.js
│   │       ├── application.service.js
│   │       ├── application.controller.js
│   │       ├── application.routes.js
│   │       └── index.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js          # Central error middleware
│   │   ├── notFound.js              # 404 catch-all
│   │   ├── adminAuth.js             # Admin key guard
│   │   └── validate.js              # Zod schema middleware runner
│   │
│   ├── utils/
│   │   ├── apiResponse.js           # Standardised response helpers
│   │   ├── AppError.js              # Custom error class
│   │   └── logger.js                # Winston logger instance
│   │
│   └── app.js                       # Express app factory (no listen)
│
├── tests/
│   ├── jobs/
│   │   ├── jobs.routes.test.js
│   │   └── jobs.service.test.js
│   └── applications/
│       ├── applications.routes.test.js
│       └── applications.service.test.js
│
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── package.json
├── server.js                        # Entry point: calls app.listen()
└── README.md
```

### Modular Pattern Rules

- **Each module owns its full vertical slice** — model, validation, service, controller, and routes.
- **Controllers are thin** — they only parse the request, call a service method, and send a response. No DB logic allowed in controllers.
- **Services are pure business logic** — all Mongoose queries and business rules live here.
- **Zod schemas are co-located** with their module in `*.schema.js` files.
- **Cross-module imports** are allowed only from `utils/`, `config/`, and `middleware/` — never between modules directly.

---

## 4. Environment Configuration

All secrets and environment-specific values must live in `.env`. Never commit `.env` to source control — commit only `.env.example`.

### `.env.example` — Required Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/quickhire

# CORS
ALLOWED_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
RATE_LIMIT_MAX=100

# Admin
ADMIN_KEY=your-strong-random-secret-here

# Logging
LOG_LEVEL=info
```

Use a dedicated `src/config/env.js` module to parse and validate all environment variables at startup using **Zod**. The app will throw a descriptive error and refuse to start if any required variable is missing or malformed.

```js
// src/config/env.js
import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGO_URI: z
    .string()
    .url("MONGO_URI must be a valid MongoDB connection string"),
  ALLOWED_ORIGIN: z.string().url("ALLOWED_ORIGIN must be a valid URL"),
  ADMIN_KEY: z.string().min(32, "ADMIN_KEY must be at least 32 characters"),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000"),
  RATE_LIMIT_MAX: z.string().default("100"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌  Invalid environment variables:\n", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
```

---

## 5. Database Design & Mongoose Models

### 5.1 Job Model

| Field       | Type    | Required | Default   | Constraints / Notes                                 |
| ----------- | ------- | -------- | --------- | --------------------------------------------------- |
| title       | String  | Yes      | —         | Trim, minLen 3, maxLen 100                          |
| company     | String  | Yes      | —         | Trim, minLen 2, maxLen 100                          |
| location    | String  | Yes      | —         | Trim, maxLen 100                                    |
| category    | String  | Yes      | —         | Enum — see below                                    |
| type        | String  | No       | Full-Time | Enum: Full-Time / Part-Time / Contract / Internship |
| description | String  | Yes      | —         | minLen 20, maxLen 5000                              |
| salaryMin   | Number  | No       | —         | min 0                                               |
| salaryMax   | Number  | No       | —         | min 0, must be >= salaryMin                         |
| currency    | String  | No       | USD       | 3-char ISO code                                     |
| isActive    | Boolean | No       | true      | Soft-delete / pause listing                         |
| createdAt   | Date    | Auto     | now       | timestamps: true                                    |
| updatedAt   | Date    | Auto     | now       | timestamps: true                                    |

**Category enum values:**
`Engineering`, `Design`, `Marketing`, `Finance`, `Operations`, `Sales`, `HR`, `Legal`, `Customer Support`, `Data`, `Product`, `Other`

**Type enum values:**
`Full-Time`, `Part-Time`, `Contract`, `Internship`

#### Virtual Field

- `applicationCount` — virtual that runs `Application.countDocuments({ job: this._id })`

#### Indexes

- Compound text index on `title` + `description` for full-text search: `{ title: 'text', description: 'text' }`
- Single field indexes on `category`, `location`, `isActive` for filtering performance

```js
// src/models/Job.model.js
import mongoose from "mongoose";

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

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    location: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, enum: CATEGORY_ENUM },
    type: { type: String, enum: TYPE_ENUM, default: "Full-Time" },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    currency: { type: String, default: "USD", maxlength: 3 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Indexes
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ isActive: 1 });

// Salary validation
jobSchema.pre("save", function (next) {
  if (this.salaryMin && this.salaryMax && this.salaryMax < this.salaryMin) {
    return next(
      new Error("salaryMax must be greater than or equal to salaryMin"),
    );
  }
  next();
});

export default mongoose.model("Job", jobSchema);
```

---

### 5.2 Application Model

| Field      | Type     | Required | Default | Constraints / Notes                         |
| ---------- | -------- | -------- | ------- | ------------------------------------------- |
| job        | ObjectId | Yes      | —       | ref: 'Job'. Validates job exists.           |
| name       | String   | Yes      | —       | Trim, minLen 2, maxLen 120                  |
| email      | String   | Yes      | —       | Lowercase, valid email format               |
| resumeLink | String   | Yes      | —       | Must match URL regex (http/https)           |
| coverNote  | String   | No       | —       | maxLen 2000                                 |
| status     | String   | No       | Pending | Enum: Pending / Reviewed / Rejected / Hired |
| createdAt  | Date     | Auto     | now     | timestamps: true                            |

#### Unique Constraint

Compound unique index on `{ job, email }` — prevents the same candidate from applying to the same job twice. On duplicate, return **HTTP 409 Conflict** with message `"You have already applied to this job."`

```js
// src/models/Application.model.js
import mongoose from "mongoose";

const URL_REGEX = /^https?:\/\/.+/;
const STATUS_ENUM = ["Pending", "Reviewed", "Rejected", "Hired"];

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    resumeLink: {
      type: String,
      required: true,
      match: [URL_REGEX, "Please provide a valid URL"],
    },
    coverNote: { type: String, maxlength: 2000 },
    status: { type: String, enum: STATUS_ENUM, default: "Pending" },
  },
  { timestamps: true },
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, email: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
```

---

## 6. API Endpoints Specification

All endpoints use the base path `/api/v1`. All responses follow the **Standard Response Envelope** defined in [Section 9](#9-error-handling-strategy).

### 6.1 Jobs

| Method | Path             | Auth    | Description                                                 |
| ------ | ---------------- | ------- | ----------------------------------------------------------- |
| GET    | /api/v1/jobs     | Public  | List all active jobs. Supports search, filter & pagination. |
| GET    | /api/v1/jobs/:id | Public  | Get single job with full details.                           |
| POST   | /api/v1/jobs     | Admin\* | Create a new job listing.                                   |
| PATCH  | /api/v1/jobs/:id | Admin\* | Update an existing job listing.                             |
| DELETE | /api/v1/jobs/:id | Admin\* | Soft-delete (set isActive: false) a listing.                |

> \* Admin routes are protected via `x-admin-key` request header.

#### GET `/api/v1/jobs` — Query Parameters

| Param    | Type    | Behaviour                                                              |
| -------- | ------- | ---------------------------------------------------------------------- |
| q        | string  | Full-text search on title and description using MongoDB `$text` index. |
| category | string  | Exact match filter against category enum.                              |
| location | string  | Case-insensitive partial match (regex).                                |
| type     | string  | Exact match on job type enum.                                          |
| page     | integer | Page number for pagination. Default: `1`.                              |
| limit    | integer | Items per page. Default: `10`. Max: `50`.                              |
| sortBy   | string  | Field to sort by. Allowed: `createdAt`, `title`. Default: `createdAt`. |
| order    | string  | `asc` or `desc`. Default: `desc`.                                      |

#### Job Response Payload

```json
{
  "success": true,
  "data": {
    "_id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Senior Frontend Engineer",
    "company": "Acme Corp",
    "location": "Remote",
    "category": "Engineering",
    "type": "Full-Time",
    "description": "We are looking for...",
    "salaryMin": 80000,
    "salaryMax": 120000,
    "currency": "USD",
    "isActive": true,
    "createdAt": "2024-06-04T10:00:00.000Z",
    "updatedAt": "2024-06-04T10:00:00.000Z"
  }
}
```

#### List Response with Pagination

```json
{
  "success": true,
  "count": 5,
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "data": [
    /* array of job objects */
  ]
}
```

---

### 6.2 Applications

| Method | Path                            | Auth    | Description                                    |
| ------ | ------------------------------- | ------- | ---------------------------------------------- |
| POST   | /api/v1/applications            | Public  | Submit application for a specific job.         |
| GET    | /api/v1/applications            | Admin\* | List all applications (with optional filters). |
| GET    | /api/v1/applications/:id        | Admin\* | Get a single application detail.               |
| GET    | /api/v1/jobs/:id/applications   | Admin\* | Get all applications for a specific job.       |
| PATCH  | /api/v1/applications/:id/status | Admin\* | Update application status.                     |

#### POST `/api/v1/applications` — Request Body

```json
{
  "job": "665f1a2b3c4d5e6f7a8b9c0d",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "resumeLink": "https://cdn.io/cv.pdf",
  "coverNote": "I am passionate about…"
}
```

#### Business Logic Rules

- Before inserting, verify the job `ObjectId` exists and `isActive === true`. Return `404` or `422` if not.
- Enforce the unique `{ job, email }` constraint. On duplicate, return `409` with message `"You have already applied to this job."`
- Return `201 Created` on success with the new application document.

---

## 7. Middleware Architecture

Middleware must be applied in the following order in `app.js`:

1. `helmet()` — sets secure HTTP headers
2. `cors({ origin: ALLOWED_ORIGIN })` — restrict cross-origin requests
3. `express.json({ limit: '10kb' })` — parse JSON bodies with size cap
4. `express.urlencoded({ extended: true })` — parse URL-encoded bodies
5. `morgan('combined')` in production / `morgan('dev')` in development
6. `express-rate-limit` — applied globally or per sensitive route
7. Route handlers — `/api/v1/jobs` and `/api/v1/applications`
8. `notFound` middleware — catch-all 404 handler
9. `errorHandler` middleware — central error formatter **(must be last)**

### Rate Limiter Configuration

```js
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please slow down." },
});

// Stricter limiter for application submissions
export const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: "Too many applications submitted. Try again later.",
  },
});
```

---

## 8. Validation Layer

Use **Zod** for all input validation. Define schemas co-located inside each module's `*.schema.js` file. A shared `validate` middleware runs the Zod parse and formats errors consistently.

### Pattern: Zod Schema → Middleware → Controller

```js
// src/modules/jobs/job.schema.js
import { z } from 'zod';

const CATEGORY_ENUM = [
  'Engineering', 'Design', 'Marketing', 'Finance', 'Operations',
  'Sales', 'HR', 'Legal', 'Customer Support', 'Data', 'Product', 'Other',
] as const;

const TYPE_ENUM = ['Full-Time', 'Part-Time', 'Contract', 'Internship'] as const;

export const createJobSchema = z.object({
  body: z.object({
    title:       z.string().trim().min(3).max(100),
    company:     z.string().trim().min(2).max(100),
    location:    z.string().trim().min(1).max(100),
    category:    z.enum(CATEGORY_ENUM),
    type:        z.enum(TYPE_ENUM).optional().default('Full-Time'),
    description: z.string().trim().min(20).max(5000),
    salaryMin:   z.number().min(0).optional(),
    salaryMax:   z.number().min(0).optional(),
    currency:    z.string().length(3).optional().default('USD'),
  }).refine(
    (data) => !data.salaryMin || !data.salaryMax || data.salaryMax >= data.salaryMin,
    { message: 'salaryMax must be >= salaryMin', path: ['salaryMax'] }
  ),
});

export const updateJobSchema = createJobSchema.deepPartial();

export const jobIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId'),
  }),
});

export const listJobsQuerySchema = z.object({
  query: z.object({
    q:        z.string().optional(),
    category: z.enum(CATEGORY_ENUM).optional(),
    location: z.string().optional(),
    type:     z.enum(TYPE_ENUM).optional(),
    page:     z.coerce.number().int().min(1).default(1),
    limit:    z.coerce.number().int().min(1).max(50).default(10),
    sortBy:   z.enum(['createdAt', 'title']).default('createdAt'),
    order:    z.enum(['asc', 'desc']).default('desc'),
  }),
});
```

### `validate.js` Middleware Runner

```js
// src/middleware/validate.js
import { ZodError } from "zod";

/**
 * @param {import('zod').ZodSchema} schema - Zod schema validating { body?, params?, query? }
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const details = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      error: "Validation failed",
      details,
    });
  }

  // Attach parsed (coerced + defaulted) values back to req
  req.body = result.data.body ?? req.body;
  req.params = result.data.params ?? req.params;
  req.query = result.data.query ?? req.query;

  next();
};
```

### Wiring Validators in Routes

```js
// src/modules/jobs/job.routes.js
import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { adminAuth } from "../../middleware/adminAuth.js";
import {
  createJobSchema,
  updateJobSchema,
  jobIdParamSchema,
  listJobsQuerySchema,
} from "./job.schema.js";
import * as jobController from "./job.controller.js";

const router = Router();

router.get("/", validate(listJobsQuerySchema), jobController.getAllJobs);
router.get("/:id", validate(jobIdParamSchema), jobController.getJobById);
router.post("/", adminAuth, validate(createJobSchema), jobController.createJob);
router.patch(
  "/:id",
  adminAuth,
  validate(updateJobSchema),
  jobController.updateJob,
);
router.delete(
  "/:id",
  adminAuth,
  validate(jobIdParamSchema),
  jobController.deleteJob,
);

export default router;
```

### Application Validators — Zod Schema

```js
// src/modules/applications/application.schema.js
import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    job: z.string().regex(/^[a-f\d]{24}$/i, "Invalid job ID"),
    name: z.string().trim().min(2).max(120),
    email: z.string().email().toLowerCase(),
    resumeLink: z.string().url("Resume link must be a valid http/https URL"),
    coverNote: z.string().max(2000).optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId"),
  }),
  body: z.object({
    status: z.enum(["Pending", "Reviewed", "Rejected", "Hired"]),
  }),
});
```

### Zod Validation Rules Summary

| Field        | Zod Rule                                                  |
| ------------ | --------------------------------------------------------- |
| job          | `z.string().regex(/^[a-f\d]{24}$/i)`                      |
| name         | `z.string().trim().min(2).max(120)`                       |
| email        | `z.string().email().toLowerCase()`                        |
| resumeLink   | `z.string().url()`                                        |
| coverNote    | `z.string().max(2000).optional()`                         |
| page / limit | `z.coerce.number()` — auto-coerces query string to number |

---

## 9. Error Handling Strategy

All errors funnel through a single Express error-handling middleware. Use a custom `AppError` class to normalise thrown errors.

### AppError Class

```js
// utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Central Error Handler

```js
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  logger.error({ statusCode, message, stack: err.stack });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
```

### Standard Response Status Codes

| HTTP Status       | `success` | When to use                                    |
| ----------------- | --------- | ---------------------------------------------- |
| 200 OK            | `true`    | Successful GET, PATCH, DELETE                  |
| 201 Created       | `true`    | Successful POST (resource created)             |
| 400 Bad Request   | `false`   | Malformed request / invalid ObjectId           |
| 401 Unauthorized  | `false`   | Missing or invalid admin key                   |
| 404 Not Found     | `false`   | Resource with given ID does not exist          |
| 409 Conflict      | `false`   | Duplicate email/application constraint         |
| 422 Unprocessable | `false`   | express-validator / Mongoose validation errors |
| 429 Too Many      | `false`   | Rate limit exceeded                            |
| 500 Server Error  | `false`   | Unhandled / unexpected errors                  |

---

## 10. Security Requirements

### Mandatory

- **`helmet()`** — sets `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, etc.
- **CORS** — only allow origins listed in `ALLOWED_ORIGIN`. Never use `cors()` without options in production.
- **Rate Limiting** — apply globally with stricter limits on `POST /applications` (e.g., 20 req / 15 min per IP).
- **Input Sanitisation** — use `.trim()` in all validators; sanitise string fields.
- **No leak in production** — do not expose stack traces or Mongoose internals in production responses.
- **ObjectId validation** — always validate params with `isMongoId()` before any DB lookup.
- **Secrets management** — `MONGO_URI` and `ADMIN_KEY` must never appear in source code.

### Admin Key Middleware

```js
// middleware/adminAuth.js
import { AppError } from "../utils/AppError.js";

export const adminAuth = (req, res, next) => {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return next(
      new AppError("Unauthorized: invalid or missing admin key", 401),
    );
  }
  next();
};
```

---

## 11. Logging & Monitoring

Use **morgan** for HTTP request logs and **winston** for application-level structured logs.

- **Development:** colorized `dev` morgan output + console transport in winston.
- **Production:** `combined` morgan format piped to winston, JSON log format, write to `logs/combined.log` and `logs/error.log`.
- **Log levels:** `error`, `warn`, `info`, `debug` — set via `LOG_LEVEL` env var.
- All unhandled rejections and uncaught exceptions must be logged, then `process.exit(1)`.

```js
// server.js
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
```

---

## 12. Testing Requirements

Write integration tests using **Jest + Supertest**, mirroring the modular folder structure. Use `mongodb-memory-server` for an in-memory test database — no external MongoDB needed for CI.

### Minimum Test Coverage

| Test Case                                 | Expected Assertion                          |
| ----------------------------------------- | ------------------------------------------- |
| GET /api/v1/jobs                          | 200 + array in `data` + `pagination` object |
| GET /api/v1/jobs?q=engineer               | 200 + results containing 'engineer'         |
| GET /api/v1/jobs/:invalidId               | 400 Invalid ID format                       |
| GET /api/v1/jobs/:nonExistentId           | 404 Not found                               |
| POST /api/v1/jobs (valid + admin key)     | 201 + created job document                  |
| POST /api/v1/jobs (missing fields)        | 422 + `details` array                       |
| POST /api/v1/jobs (no admin key)          | 401 Unauthorized                            |
| DELETE /api/v1/jobs/:id                   | 200 + `isActive: false`                     |
| POST /api/v1/applications (valid)         | 201 + application document                  |
| POST /api/v1/applications (duplicate)     | 409 Conflict                                |
| POST /api/v1/applications (invalid email) | 422 Validation failed                       |
| POST /api/v1/applications (invalid URL)   | 422 Validation failed                       |

### Test Setup Example

```js
// tests/setup.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
```

---

## 13. Git Workflow & Commit Standards

Use **Conventional Commits** format. Commit often — at least once per logical unit of work.

### Conventional Commit Format

```
<type>(<scope>): <short description>

Types: feat | fix | docs | chore | refactor | test | style
```

### Examples

```
feat(jobs): add GET /jobs endpoint with search and pagination
feat(jobs): add POST /jobs endpoint with admin key protection
feat(applications): implement POST /applications with duplicate guard
feat(applications): add GET /jobs/:id/applications admin endpoint
fix(validation): correct URL validator regex for resumeLink field
fix(error): handle Mongoose CastError for invalid ObjectId params
refactor(jobs): extract query-building logic into job.service.js
chore(deps): add helmet, cors, and express-rate-limit packages
test(jobs): add integration tests for job CRUD endpoints
test(applications): add duplicate application constraint test
docs(readme): add setup instructions and environment variable table
```

### Recommended Branch Strategy

| Branch      | Purpose                                   |
| ----------- | ----------------------------------------- |
| `main`      | Production-ready, stable code only        |
| `develop`   | Integration branch for features           |
| `feature/*` | Individual feature branches merged via PR |

---

## 14. README Requirements

The `README.md` must include all of the following sections:

1. Project overview and purpose (2–3 sentences)
2. Tech stack list
3. Prerequisites (Node.js version, MongoDB)
4. Installation steps (`git clone` → `npm install`)
5. Environment setup (`.env.example` reference + table of all variables)
6. Running locally — `npm run dev` command
7. Running tests — `npm test` command
8. API reference — table of all endpoints with method, path, auth, description
9. Folder structure diagram
10. Live demo link (if deployed)

---

## 15. Deployment Checklist

Recommended platforms: **Railway**, **Render**, or **Fly.io** (backend) + **MongoDB Atlas** (database).

### Pre-Deployment Checklist

- [ ] `NODE_ENV=production` set in hosting environment
- [ ] `MONGO_URI` points to MongoDB Atlas cluster (not localhost)
- [ ] `ALLOWED_ORIGIN` set to production frontend URL
- [ ] `ADMIN_KEY` is a strong random string (>= 32 chars)
- [ ] All tests passing: `npm test`
- [ ] No `.env` file committed to repository
- [ ] `.env.example` committed and up to date
- [ ] `package.json` start script set: `"start": "node server.js"`
- [ ] `logs/` directory added to `.gitignore`
- [ ] README live demo link updated with deployed URL

### Health Check Endpoint

Add a `/api/v1/health` endpoint that returns `200` for uptime monitoring:

```js
// src/routes/health.routes.js
import mongoose from "mongoose";

router.get("/health", (req, res) => {
  const dbState =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    success: true,
    status: "ok",
    db: dbState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
```

---

_QuickHire Backend Technical Requirements Specification — v1.0.0_
