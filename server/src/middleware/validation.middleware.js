import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to handle express-validator errors
 * Returns a 400 Bad Request with the validation errors if validation fails
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    
    throw new ApiError(400, `Validation Failed: ${JSON.stringify(extractedErrors)}`);
  }
  next();
};
