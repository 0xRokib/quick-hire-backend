// src/middleware/notFound.js — 404 catch-all middleware
import { errorResponse } from "../utils/apiResponse.js";

const notFound = (req, res) => {
  return errorResponse(res, { statusCode: 404, error: "Not Found" });
};

export default notFound;
