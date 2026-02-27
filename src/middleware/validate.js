// src/middleware/validate.js — Zod schema middleware runner
import { errorResponse } from "../utils/apiResponse.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const details = result.error.errors.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));
    const hasInvalidObjectIdError = result.error.errors.some((error) =>
      /invalid mongo(db)? objectid|invalid job id/i.test(error.message),
    );

    return errorResponse(res, {
      statusCode: hasInvalidObjectIdError ? 400 : 422,
      error: "Validation failed",
      details,
    });
  }

  req.body = result.data.body ?? req.body;
  req.params = result.data.params ?? req.params;
  req.query = result.data.query ?? req.query;

  return next();
};

export default validate;
