import { body } from 'express-validator';

export const createSegmentValidator = [
  body('name').isString().notEmpty().withMessage('Segment name is required'),
  body('description').optional().isString(),
  body('isDynamic').optional().isBoolean(),
  body('logicOperator').optional().isIn(['AND', 'OR']),
  body('rules').isArray({ min: 1 }).withMessage('At least 1 rule required'),
  body('rules.*.type').isIn(['event', 'property', 'session', 'journey', 'feature']).withMessage('Invalid rule type'),
  body('rules.*.key').isString().notEmpty(),
  body('rules.*.operator').isIn(['eq', 'neq', 'gt', 'lt', 'contains', 'exists']),
];
