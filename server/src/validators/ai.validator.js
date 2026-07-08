import { body } from 'express-validator';

export const chatValidator = [
  body('message').isString().notEmpty().withMessage('Message is required'),
  body('conversationId').optional().isMongoId().withMessage('Invalid conversation ID')
];
