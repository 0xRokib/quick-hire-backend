// src/app.js — Express app factory (no listen)
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRouter from "./modules/auth/index.js";
import jobsRouter from "./modules/jobs/index.js";
import applicationsRouter from "./modules/applications/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.ALLOWED_ORIGIN }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please slow down." },
});
app.use(apiLimiter);

const healthRouter = express.Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api/v1/jobs", jobsRouter);
app.use("/api/v1/applications", applicationsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/health", healthRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
