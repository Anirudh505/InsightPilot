import { env } from '../config/env.config.js';
import logger from '../config/logger.config.js';
import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 500 : 400;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  // Log server errors
  if (statusCode === 500) {
    logger.error(`[${req.method}] ${req.url} >> StatusCode:: ${statusCode}, Message:: ${message}`);
  }

  const response = {
    success: false,
    statusCode,
    message,
    ...(env.nodeEnv === 'development' && { stack: error.stack }),
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};
