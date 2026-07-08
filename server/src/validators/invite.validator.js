import { body, param } from 'express-validator';
import { ROLE_VALUES } from '../constants/roles.js';

export const inviteUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('role')
    .isString()
    .isIn(ROLE_VALUES)
    .withMessage(`Role must be one of: ${ROLE_VALUES.join(', ')}`),
];

export const acceptInviteValidator = [
  body('token')
    .isString()
    .notEmpty()
    .withMessage('Invitation token is required'),
];

export const inviteIdParamValidator = [
  param('inviteId')
    .isMongoId()
    .withMessage('Invalid invite ID format'),
];
