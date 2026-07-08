import { body } from 'express-validator';

export const createProjectValidator = [
  body('name').isString().trim().notEmpty().withMessage('Project name is required').isLength({ max: 150 }),
  body('slug').isString().trim().notEmpty().matches(/^[a-z0-9-]+$/).withMessage('Invalid slug format'),
  body('workspace').isMongoId().withMessage('Workspace ID is required'),
  body('environment').optional().isIn(['development', 'staging', 'production']),
  body('platform').optional().isIn(['web', 'ios', 'android', 'backend', 'other']),
  body('description').optional().isString().isLength({ max: 1000 }),
  body('domain').optional().isString()
];

export const updateProjectValidator = [
  body('name').optional().isString().trim().isLength({ max: 150 }),
  body('slug').optional().isString().trim().matches(/^[a-z0-9-]+$/),
  body('environment').optional().isIn(['development', 'staging', 'production']),
  body('platform').optional().isIn(['web', 'ios', 'android', 'backend', 'other']),
  body('domain').optional().isString(),
  body('description').optional().isString().isLength({ max: 1000 })
];

export const updateProjectSettingsValidator = [
  body('timezone').optional().isString(),
  body('currency').optional().isString(),
  body('retentionDays').optional().isNumeric(),
  body('trackingEnabled').optional().isBoolean(),
  body('aiEnabled').optional().isBoolean(),
  body('theme').optional().isIn(['light', 'dark', 'system']),
];
