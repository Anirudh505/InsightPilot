import { body } from 'express-validator';

export const createOrganizationValidator = [
  body('companyName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 150 })
    .withMessage('Company name cannot exceed 150 characters'),
  body('slug')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .isString()
    .isLength({ max: 1000 }),
  body('website')
    .optional()
    .isURL()
    .withMessage('Must be a valid URL'),
  body('industry')
    .optional()
    .isString(),
  body('companySize')
    .optional()
    .isString(),
  body('country')
    .optional()
    .isString(),
  body('timezone')
    .optional()
    .isString(),
  body('billingEmail')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address'),
];

export const updateOrganizationValidator = [
  body('companyName').optional().isString().trim().isLength({ max: 150 }),
  body('slug').optional().isString().trim().matches(/^[a-z0-9-]+$/),
  body('description').optional().isString().isLength({ max: 1000 }),
  body('website').optional().isURL(),
  body('industry').optional().isString(),
  body('companySize').optional().isString(),
  body('country').optional().isString(),
  body('timezone').optional().isString(),
  body('billingEmail').optional().isEmail(),
];
