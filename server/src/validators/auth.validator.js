import { body } from 'express-validator';

export const registerValidator = [
  body('fullName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required'),
];
