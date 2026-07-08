import { body } from 'express-validator';

export const createDashboardValidator = [
  body('name').isString().notEmpty().withMessage('Dashboard name is required'),
  body('type').optional().isIn(['Executive', 'Product', 'Growth', 'Marketing', 'Engineering', 'Custom']),
  body('isDefault').optional().isBoolean()
];

export const widgetValidator = [
  body('type').isString().notEmpty(),
  body('title').isString().notEmpty(),
  body('config').optional().isObject(),
  body('layout').optional().isObject()
];

export const layoutUpdateValidator = [
  body('updates').isArray().withMessage('Updates array is required'),
  body('updates.*._id').isMongoId(),
  body('updates.*.layout.x').isNumeric(),
  body('updates.*.layout.y').isNumeric(),
  body('updates.*.layout.w').isNumeric(),
  body('updates.*.layout.h').isNumeric()
];
