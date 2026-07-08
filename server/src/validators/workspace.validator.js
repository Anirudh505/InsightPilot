import { body } from 'express-validator';

export const createWorkspaceValidator = [
  body('name').isString().trim().notEmpty().withMessage('Workspace name is required').isLength({ max: 150 }),
  body('slug').isString().trim().notEmpty().withMessage('Slug is required').matches(/^[a-z0-9-]+$/).withMessage('Invalid slug format'),
  body('organization').isMongoId().withMessage('Organization ID is required'),
  body('description').optional().isString().isLength({ max: 1000 }),
];

export const updateWorkspaceValidator = [
  body('name').optional().isString().trim().isLength({ max: 150 }),
  body('slug').optional().isString().trim().matches(/^[a-z0-9-]+$/),
  body('description').optional().isString().isLength({ max: 1000 }),
];
