// src/modules/jobs/job.controller.js — Request/response handling for Jobs
import * as jobService from "./job.service.js";
import { paginatedResponse, successResponse } from "../../utils/apiResponse.js";

export const getAllJobs = async (req, res, next) => {
  try {
    const result = await jobService.getAllJobs(req.query);
    return paginatedResponse(res, {
      statusCode: 200,
      data: result.jobs,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    return next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    return successResponse(res, { statusCode: 200, data: job });
  } catch (error) {
    return next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body);
    return successResponse(res, { statusCode: 201, data: job });
  } catch (error) {
    return next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, data: job });
  } catch (error) {
    return next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    return successResponse(res, { statusCode: 200, data: job });
  } catch (error) {
    return next(error);
  }
};
