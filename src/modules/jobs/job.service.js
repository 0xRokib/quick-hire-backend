// src/modules/jobs/job.service.js — DB queries & business logic for Jobs
import AppError from '../../utils/AppError.js';
import Job from './job.model.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildJobFilters = ({ q, category, location, type }) => {
  const filters = { isActive: true };

  if (q) {
    const safeQ = escapeRegex(q);
    const regex = { $regex: safeQ, $options: 'i' };
    filters.$or = [{ title: regex }, { company: regex }, { description: regex }];
  }

  if (category) {
    filters.category = category;
  }

  if (type) {
    filters.type = type;
  }

  if (location) {
    filters.location = { $regex: escapeRegex(location), $options: 'i' };
  }

  return filters;
};

const validateSalaryRange = (salaryMin, salaryMax) => {
  if (salaryMin != null && salaryMax != null && salaryMax < salaryMin) {
    throw new AppError('salaryMax must be greater than or equal to salaryMin', 422);
  }
};

export const getAllJobs = async (query) => {
  const {
    q,
    category,
    location,
    type,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const filters = buildJobFilters({ q, category, location, type });
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

  const [total, jobs] = await Promise.all([
    Job.countDocuments(filters),
    Job.find(filters).populate('applicationCount').sort(sort).skip(skip).limit(limit),
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

export const getJobById = async (id) => {
  const job = await Job.findOne({ _id: id, isActive: true }).populate('applicationCount');
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  return job;
};

export const createJob = async (payload) => {
  validateSalaryRange(payload.salaryMin, payload.salaryMax);
  return Job.create(payload);
};

export const updateJob = async (id, payload) => {
  const job = await Job.findById(id);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const nextSalaryMin = payload.salaryMin ?? job.salaryMin;
  const nextSalaryMax = payload.salaryMax ?? job.salaryMax;
  validateSalaryRange(nextSalaryMin, nextSalaryMax);

  Object.assign(job, payload);
  await job.save();

  return job;
};

export const deleteJob = async (id) => {
  const job = await Job.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  return job;
};
