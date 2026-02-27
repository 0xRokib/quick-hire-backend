// src/app.js — Express app factory (no listen)
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import jobsRouter from "./modules/jobs/index.js";
import applicationsRouter from "./modules/applications/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(apiLimiter);

const healthRouter = express.Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api/v1/jobs", jobsRouter);
app.use("/api/v1/applications", applicationsRouter);
app.use("/api/v1/health", healthRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
