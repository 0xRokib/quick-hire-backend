// src/utils/apiResponse.js — Standardised response helpers
export const successResponse = (
  res,
  { statusCode = 200, data, message, extra = {} } = {},
) => {
  const payload = {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
    ...extra,
  };

  return res.status(statusCode).json(payload);
};

export const paginatedResponse = (
  res,
  { statusCode = 200, data = [], total = 0, page = 1, limit = 10, message } = {},
) => {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    count: data.length,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data,
  });
};

export const errorResponse = (
  res,
  { statusCode = 500, error = "Internal Server Error", details, extra = {} } = {},
) => {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(details ? { details } : {}),
    ...extra,
  });
};
