import { body } from 'express-validator';

export const createFunnelValidator = [
  body('name').isString().notEmpty().withMessage('Funnel name is required'),
  body('description').optional().isString(),
  body('conversionWindowMinutes').optional().isNumeric(),
  body('steps').isArray({ min: 2 }).withMessage('At least 2 steps required'),
  body('steps.*.order').isNumeric(),
  body('steps.*.eventName').isString().notEmpty(),
  body('steps.*.filters').optional().isArray()
];

export const calculateFunnelValidator = [
  body('startDate').isISO8601().toDate().withMessage('Valid startDate required'),
  body('endDate').isISO8601().toDate().withMessage('Valid endDate required')
];
