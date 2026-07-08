import { body } from 'express-validator';

// Base validations for any single event payload
const eventBaseValidations = [
  body('anonymousId').isString().notEmpty().withMessage('anonymousId is required'),
  body('event').isString().notEmpty().withMessage('Event name is required'),
  body('type').isIn(['page', 'screen', 'track', 'identify', 'group', 'alias']).withMessage('Invalid event type'),
  body('timestamp').optional().isISO8601(),
  body('properties').optional().isObject(),
  body('context').optional().isObject(),
  body('userId').optional().isString()
];

export const trackEventValidator = [...eventBaseValidations];

export const batchTrackValidator = [
  body('events').isArray({ min: 1, max: 100 }).withMessage('Events array is required (max 100)'),
  body('events.*.anonymousId').isString().notEmpty().withMessage('anonymousId is required in all events'),
  body('events.*.event').isString().notEmpty().withMessage('Event name is required in all events'),
  body('events.*.type').isIn(['page', 'screen', 'track', 'identify', 'group', 'alias']).withMessage('Invalid event type in batch')
];
