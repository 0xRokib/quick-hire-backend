// src/modules/applications/application.controller.js — Request/response handling for Applications
import { paginatedResponse, successResponse } from "../../utils/apiResponse.js";
import * as applicationService from "./application.service.js";

export const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(req.body);
    return successResponse(res, { statusCode: 201, data: application });
  } catch (error) {
    return next(error);
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const result = await applicationService.getAllApplications(req.query);
    return paginatedResponse(res, {
      statusCode: 200,
      data: result.applications,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    return next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    return successResponse(res, { statusCode: 200, data: application });
  } catch (error) {
    return next(error);
  }
};

export const getApplicationsByJobId = async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsByJobId(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      data: applications,
      extra: { count: applications.length },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      req.body.status,
    );
    return successResponse(res, { statusCode: 200, data: application });
  } catch (error) {
    return next(error);
  }
};
