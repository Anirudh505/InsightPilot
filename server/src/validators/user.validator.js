import { body } from 'express-validator';

export const updateProfileValidator = [
  body('fullName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('username')
    .optional()
    .isString()
    .trim()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('bio')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('phone')
    .optional()
    .isString()
    .isLength({ max: 20 }),
  body('timezone')
    .optional()
    .isString(),
  body('country')
    .optional()
    .isString(),
  body('language')
    .optional()
    .isString()
    .isLength({ min: 2, max: 10 }),
];

export const updateNotificationSettingsValidator = [
  body('email').optional().isBoolean(),
  body('inApp').optional().isBoolean(),
  body('marketing').optional().isBoolean(),
];
