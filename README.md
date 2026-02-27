# QuickHire Backend

QuickHire is a mini job board platform. This is the RESTful API backend responsible for managing job listings, accepting candidate applications, and exposing a clean, well-validated JSON interface.

## Tech Stack

- **Runtime:** Node.js (>= 18 LTS)
- **Framework:** Express.js ^4.18
- **Database:** MongoDB ^7.0 (via Mongoose ^8.x)
- **Validation:** Zod ^3.x
- **Security:** Helmet, CORS, express-rate-limit
- **Logging:** Morgan + Winston
- **Testing:** Jest + Supertest + mongodb-memory-server
- **Dev Tooling:** Nodemon, ESLint, Prettier

## Prerequisites

- Node.js >= 18
- MongoDB (local) or MongoDB Atlas account
- npm or yarn

## Installation

```bash
git clone <repository-url>
cd quickhire-backend
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable             | Description                       | Default                             |
| -------------------- | --------------------------------- | ----------------------------------- |
| PORT                 | Server port                       | 5000                                |
| NODE_ENV             | Environment                       | development                         |
| MONGO_URI            | MongoDB connection string         | mongodb://localhost:27017/quickhire |
| ALLOWED_ORIGIN       | CORS allowed origin               | http://localhost:3000               |
| RATE_LIMIT_WINDOW_MS | Rate limit window (ms)            | 900000                              |
| RATE_LIMIT_MAX       | Max requests per window           | 100                                 |
| JWT_SECRET           | HMAC secret for auth token signing | —                                   |
| JWT_ACCESS_EXPIRES_IN| Access token TTL (e.g. 15m)        | 15m                                 |
| JWT_REFRESH_EXPIRES_IN| Refresh token TTL (e.g. 7d)       | 7d                                  |
| AUTH_LOGIN_WINDOW_MS | Login rate-limit window (ms)       | 900000                              |
| AUTH_LOGIN_MAX_REQUESTS | Max login requests/IP per window| 20                                  |
| AUTH_ACCOUNT_MAX_FAILURES | Failed password attempts before lock | 5                            |
| AUTH_ACCOUNT_LOCK_MS | Account lock duration after failures (ms) | 900000                    |
| LOG_LEVEL            | Winston log level                 | info                                |

## Running Locally

```bash
npm run dev
```

## Running Tests

```bash
npm test
```

## API Endpoints

| Method | Path                            | Auth   | Description                          |
| ------ | ------------------------------- | ------ | ------------------------------------ |
| GET    | /api/v1/health                  | Public | Health check                         |
| POST   | /api/v1/auth/register           | Public | Register new user (first can be admin) |
| POST   | /api/v1/auth/login              | Public | Login and receive bearer token       |
| POST   | /api/v1/auth/refresh            | Public | Rotate refresh token and issue new access token |
| POST   | /api/v1/auth/logout             | User   | Clear active refresh token           |
| GET    | /api/v1/auth/me                 | User   | Get current authenticated user        |
| GET    | /api/v1/auth/users              | Admin  | List users (admin-only, role check)   |
| GET    | /api/v1/jobs                    | Public | List all active jobs (search/filter) |
| GET    | /api/v1/jobs/:id                | Public | Get single job details               |
| POST   | /api/v1/jobs                    | Admin  | Create a new job listing             |
| PATCH  | /api/v1/jobs/:id                | Admin  | Update a job listing                 |
| DELETE | /api/v1/jobs/:id                | Admin  | Soft-delete a job listing            |
| POST   | /api/v1/applications            | Public | Submit an application                |
| GET    | /api/v1/applications            | Admin  | List all applications                |
| GET    | /api/v1/applications/:id        | Admin  | Get single application               |
| GET    | /api/v1/jobs/:id/applications   | Admin  | Get applications for a job           |
| PATCH  | /api/v1/applications/:id/status | Admin  | Update application status            |

## Folder Structure

```
quickhire-backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── user.model.js
│   │   │   ├── auth.schema.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── index.js
│   │   ├── jobs/
│   │   │   ├── job.model.js
│   │   │   ├── job.schema.js
│   │   │   ├── job.service.js
│   │   │   ├── job.controller.js
│   │   │   ├── job.routes.js
│   │   │   └── index.js
│   │   └── applications/
│   │       ├── application.model.js
│   │       ├── application.schema.js
│   │       ├── application.service.js
│   │       ├── application.controller.js
│   │       ├── application.routes.js
│   │       └── index.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   ├── auth.js
│   │   ├── adminAuth.js
│   │   └── validate.js
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── AppError.js
│   │   ├── logger.js
│   │   ├── password.js
│   │   └── token.js
│   └── app.js
├── tests/
│   ├── setup.js
│   ├── jobs/
│   │   ├── jobs.routes.test.js
│   │   └── jobs.service.test.js
│   └── applications/
│       ├── applications.routes.test.js
│       └── applications.service.test.js
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Live Demo

> _Coming soon_
