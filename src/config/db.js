// src/config/db.js — Mongoose connection factory
import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = () => mongoose.connect(env.MONGO_URI);
