import { query } from 'express-validator';

export const analyticsQueryValidator = [
  query('projectId').isMongoId().withMessage('Valid Project ID is required'),
  query('range').optional().isIn(['today', 'yesterday', '7d', '30d', '90d']).withMessage('Invalid date range')
];
