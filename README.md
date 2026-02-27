# QuickHire Backend

Production-oriented REST API for a mini job board.  
Built with Express.js, MongoDB/Mongoose, Zod validation, and role-based authentication.

## Status

- Core backend features are implemented: auth, jobs, applications, role-based admin controls.
- Middleware and operational pieces are in place: validation, centralized error handling, health check, logging, rate limiting.
- Test files exist as scaffolds and should be completed before production rollout.

## Core Features

- Role-based authentication (`public`, `user`, `admin`) with access and refresh tokens.
- Admin bootstrap protection (first account can be admin; later admin self-registration is blocked).
- Jobs API with search, filtering, sorting, pagination, and soft-delete.
- Applications API with duplicate prevention (`job + email`), status workflow, and admin review endpoints.
- Standardized API response format for success, pagination, and errors.
- Security middleware: `helmet`, scoped `cors`, global and route-specific rate limiting.
- Health endpoint with DB connectivity, uptime, and timestamp.
- Structured logging with Morgan + Winston (`combined.log`, `error.log` in production).

## Tech Stack

| Category | Technology |
| --- | --- |
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Validation | Zod |
| Security | helmet, cors, express-rate-limit |
| Logging | morgan, winston |
| Testing | Jest, Supertest, mongodb-memory-server |
| Tooling | Nodemon, ESLint, Prettier |

## Architecture

Feature-first modular structure:

- Each module owns model, schema, service, controller, routes.
- Controllers are thin request/response handlers.
- Services hold business logic and database operations.
- Shared cross-cutting code lives in `config/`, `middleware/`, and `utils/`.

## Prerequisites

- Node.js `>=18`
- npm
- MongoDB (local or Atlas)

## Quick Start

```bash
git clone <repository-url>
cd quickhire-backend
npm install
cp .env.example .env
npm run dev
```

Server default URL: `http://localhost:5000`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run with nodemon |
| `npm start` | Run production entrypoint |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

## Environment Variables

Copy `.env.example` to `.env` and set values:

| Variable | Required | Description | Default |
| --- | --- | --- | --- |
| `PORT` | No | API port | `5000` |
| `NODE_ENV` | No | Runtime mode (`development`, `test`, `production`) | `development` |
| `MONGO_URI` | Yes | MongoDB connection string | - |
| `ALLOWED_ORIGIN` | Yes | Allowed CORS origin (Vite dev: `http://localhost:5173`) | - |
| `RATE_LIMIT_WINDOW_MS` | No | Global rate-limit window (ms) | `900000` |
| `RATE_LIMIT_MAX` | No | Global max requests per window | `100` |
| `JWT_SECRET` | Yes | HMAC secret for token signing (32+ chars) | - |
| `JWT_ACCESS_EXPIRES_IN` | No | Access token TTL (e.g. `15m`) | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh token TTL (e.g. `7d`) | `7d` |
| `AUTH_LOGIN_WINDOW_MS` | No | Login limiter window (ms) | `900000` |
| `AUTH_LOGIN_MAX_REQUESTS` | No | Max login requests per IP per window | `20` |
| `AUTH_ACCOUNT_MAX_FAILURES` | No | Failed logins before lockout | `5` |
| `AUTH_ACCOUNT_LOCK_MS` | No | Account lock duration (ms) | `900000` |
| `LOG_LEVEL` | No | Winston log level | `info` |

## Authentication and Roles

### Role Behavior

- `public`: browse jobs, view job details, submit applications, register/login/refresh.
- `user`: everything public + `GET /auth/me` + logout.
- `admin`: everything user + manage jobs, review/manage applications, list users.

### Token Flow

1. Login/register returns `accessToken` and `refreshToken`.
2. Use `Authorization: Bearer <accessToken>` for protected routes.
3. Use `POST /api/v1/auth/refresh` with `refreshToken` to rotate tokens.
4. Use `POST /api/v1/auth/logout` to invalidate refresh session.

### Login Protection

- IP-based limiter on login route.
- Temporary account lockout after repeated failed passwords.

## API Response Contract

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Paginated List

```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "data": []
}
```

### Error

```json
{
  "success": false,
  "error": "Validation failed",
  "details": []
}
```

## Endpoint Reference

### Auth

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Public | Register user (first user may set `role=admin`) |
| `POST` | `/api/v1/auth/login` | Public | Login and receive tokens |
| `POST` | `/api/v1/auth/refresh` | Public | Rotate refresh and access tokens |
| `POST` | `/api/v1/auth/logout` | User/Admin | Logout and clear refresh session |
| `GET` | `/api/v1/auth/me` | User/Admin | Current authenticated user |
| `GET` | `/api/v1/auth/users` | Admin | List users |

### Jobs

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/jobs` | Public | List active jobs |
| `GET` | `/api/v1/jobs/:id` | Public | Job details |
| `POST` | `/api/v1/jobs` | Admin | Create job |
| `PATCH` | `/api/v1/jobs/:id` | Admin | Update job |
| `DELETE` | `/api/v1/jobs/:id` | Admin | Soft-delete job |

### Applications

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/applications` | Public | Submit application |
| `GET` | `/api/v1/applications` | Admin | List applications |
| `GET` | `/api/v1/applications/:id` | Admin | Application details |
| `PATCH` | `/api/v1/applications/:id/status` | Admin | Update application status |
| `GET` | `/api/v1/jobs/:id/applications` | Admin | List applications for a job |

### Health

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | Public | Service and DB health |

## Query Parameters

### `GET /api/v1/jobs`

- `q`: full-text search
- `category`: category filter
- `location`: case-insensitive location filter
- `type`: job type filter
- `page`: default `1`
- `limit`: default `10`, max `50`
- `sortBy`: `createdAt` or `title`
- `order`: `asc` or `desc`

### `GET /api/v1/applications` (Admin)

- `job`: job ObjectId
- `status`: `Pending | Reviewed | Rejected | Hired`
- `email`: applicant email
- `page`: default `1`
- `limit`: default `10`, max `50`
- `order`: `asc` or `desc`

## Validation and Error Behavior

- Validation errors return `422` by default.
- Invalid ObjectId-style validation returns `400`.
- Duplicate key conflicts return `409`.
- Missing/invalid auth returns `401`.
- Permission violations return `403`.
- Not found returns `404`.

## Security and Rate Limits

- `helmet()` enabled globally.
- CORS restricted to `ALLOWED_ORIGIN`.
- Global rate limiting from `RATE_LIMIT_*`.
- Additional apply limiter on `POST /api/v1/applications` (`20/15m`).
- Login-specific limiter on `POST /api/v1/auth/login`.

## Logging and Health

### Logging

- Development: console logging.
- Production: HTTP logs via Morgan `combined` piped to Winston.
- Production: app logs stored in `logs/combined.log`.
- Production: error logs stored in `logs/error.log`.

### Health Endpoint

`GET /api/v1/health` response includes:

- `status`
- `db` connection state (`connected` / `disconnected`)
- `uptime`
- `timestamp`

## Folder Structure

```text
quickhire-backend/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── jobs/
│   │   └── applications/
│   ├── utils/
│   └── app.js
├── tests/
├── .env.example
├── package.json
└── server.js
```

## Deployment Checklist

- Set `NODE_ENV=production`.
- Configure all required environment variables.
- Point `MONGO_URI` to production DB.
- Set strict `ALLOWED_ORIGIN` to frontend domain.
- Ensure logs directory is writable in deployment environment.
- Complete and pass test suite before release.

## Live Demo

Coming soon.
