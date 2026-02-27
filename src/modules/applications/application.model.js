// src/modules/applications/application.model.js — Mongoose schema & model for Application
import mongoose from "mongoose";

const URL_REGEX = /^https?:\/\/.+/;
export const STATUS_ENUM = ["Pending", "Reviewed", "Rejected", "Hired"];

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
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
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    resumeLink: {
      type: String,
      required: true,
      match: [URL_REGEX, "Please provide a valid URL"],
    },
    coverNote: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: STATUS_ENUM,
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true },
);

applicationSchema.index({ job: 1, email: 1 }, { unique: true });
applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
