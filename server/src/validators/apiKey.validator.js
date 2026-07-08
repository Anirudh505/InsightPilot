import { body } from 'express-validator';

export const createApiKeyValidator = [
  body('name').isString().trim().notEmpty().withMessage('API Key name is required'),
  body('environment').isIn(['development', 'staging', 'production']).withMessage('Invalid environment'),
  body('permissions').optional().isArray(),
  body('expiresAt').optional().isISO8601().toDate()
];
