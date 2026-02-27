// src/modules/applications/application.service.js — DB queries & business logic for Applications
import mongoose from "mongoose";
import AppError from "../../utils/AppError.js";
import Application from "./application.model.js";

const getJobModel = () => {
  const jobModel = mongoose.models.Job;
  if (!jobModel) {
    throw new AppError("Job model is not initialized", 500);
  }

  return jobModel;
};

const ensureJobAcceptsApplications = async (jobId) => {
  const Job = getJobModel();
  const job = await Job.findById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (!job.isActive) {
    throw new AppError("Cannot apply to an inactive job", 422);
  }
};

export const createApplication = async (payload) => {
  await ensureJobAcceptsApplications(payload.job);

  try {
    return await Application.create(payload);
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError("You have already applied to this job.", 409);
    }
    throw error;
  }
};

export const getAllApplications = async (query) => {
  const { job, status, email, page = 1, limit = 10, order = "desc" } = query;
  const filters = {};

  if (job) {
    filters.job = job;
  }
  if (status) {
    filters.status = status;
  }
  if (email) {
    filters.email = email;
  }

  const skip = (page - 1) * limit;
  const sort = { createdAt: order === "asc" ? 1 : -1 };

  const [total, applications] = await Promise.all([
    Application.countDocuments(filters),
    Application.find(filters).populate("job").sort(sort).skip(skip).limit(limit),
  ]);

  return {
    applications,
    total,
    page,
    limit,
  };
};

export const getApplicationById = async (id) => {
  const application = await Application.findById(id).populate("job");
  if (!application) {
    throw new AppError("Application not found", 404);
  }

  return application;
};

export const getApplicationsByJobId = async (jobId) => {
  const Job = getJobModel();
  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return Application.find({ job: jobId }).populate("job").sort({ createdAt: -1 });
};

export const updateApplicationStatus = async (id, status) => {
  const application = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  ).populate("job");

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  return application;
};
