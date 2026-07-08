import { body } from 'express-validator';

export const createCohortValidator = [
  body('name').isString().notEmpty().withMessage('Cohort name is required'),
  body('description').optional().isString(),
  body('isDynamic').optional().isBoolean(),
  body('rules').isArray({ min: 1 }).withMessage('At least 1 rule required'),
  body('rules.*.type').isIn(['event', 'property', 'session']).withMessage('Invalid rule type'),
  body('rules.*.operator').isIn(['eq', 'neq', 'gt', 'lt', 'contains', 'exists']),
];
