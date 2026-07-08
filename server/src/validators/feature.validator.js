import { body, query } from 'express-validator';

export const createFeatureValidator = [
  body('name').isString().notEmpty().withMessage('Feature name is required'),
  body('description').optional().isString(),
  body('triggerEvent').isString().notEmpty().withMessage('Trigger event is required'),
  body('filters').optional().isArray()
];

export const getAdoptionValidator = [
  query('start_date').isISO8601().toDate().withMessage('Valid start_date required'),
  query('end_date').isISO8601().toDate().withMessage('Valid end_date required')
];
