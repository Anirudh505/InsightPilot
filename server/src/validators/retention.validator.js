import { query } from 'express-validator';

export const getRetentionValidator = [
  query('start_date').isISO8601().toDate().withMessage('Valid start_date required'),
  query('end_date').isISO8601().toDate().withMessage('Valid end_date required'),
  query('start_event').optional().isString(),
  query('return_event').optional().isString()
];
