import { body } from 'express-validator';

export const chatValidator = [
  body('message').isString().notEmpty().withMessage('Message is required'),
  body('conversationId').optional({ nullable: true }).isMongoId().withMessage('Invalid conversation ID')
];
