// src/modules/jobs/job.model.js — Mongoose schema & model for Job
import mongoose from 'mongoose';

export const CATEGORY_ENUM = [
  'Engineering',
  'Design',
  'Marketing',
  'Finance',
  'Operations',
  'Sales',
  'HR',
  'Legal',
  'Customer Support',
  'Data',
  'Product',
  'Other',
];

export const TYPE_ENUM = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];

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
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORY_ENUM,
    },
    type: {
      type: String,
      enum: TYPE_ENUM,
      default: 'Full-Time',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      maxlength: 3,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });

jobSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  count: true,
});

jobSchema.pre('save', function validateSalaryRange(next) {
  if (
    this.salaryMin != null &&
    this.salaryMax != null &&
    Number(this.salaryMax) < Number(this.salaryMin)
  ) {
    next(new Error('salaryMax must be greater than or equal to salaryMin'));
    return;
  }

  next();
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
