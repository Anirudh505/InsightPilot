import express from 'express';
import segmentController from '../controllers/segments.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createSegmentValidator } from '../validators/segment.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: Dynamic user segmentation
 */

router.route('/')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), segmentController.getSegments)
  .post(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createSegmentValidator, validate, segmentController.createSegment);

router.route('/:segmentId')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), segmentController.getSegmentById)
  .put(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createSegmentValidator, validate, segmentController.updateSegment)
  .delete(authorizeProjectRoles(ROLES.PROJECT_MANAGER), segmentController.deleteSegment);

router.post('/:segmentId/calculate', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), 
  segmentController.calculateSegment
);

export default router;
