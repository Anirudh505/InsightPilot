import express from 'express';
import retentionController from '../controllers/retention.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { getRetentionValidator } from '../validators/retention.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Retention
 *   description: N-Day retention and lifecycle analytics
 */

router.get('/heatmap', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  getRetentionValidator, validate, 
  retentionController.getRetentionHeatmap
);

router.get('/lifecycle', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  retentionController.getLifecycleOverview
);

export default router;
