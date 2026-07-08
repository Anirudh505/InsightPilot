import { body } from 'express-validator';

export const createGoalValidator = [
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
  body('triggerEvent').isString().notEmpty(),
  body('filters').optional().isArray()
];
