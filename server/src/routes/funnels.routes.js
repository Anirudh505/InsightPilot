import express from 'express';
import funnelController from '../controllers/funnels.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createFunnelValidator, calculateFunnelValidator } from '../validators/funnel.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Funnels
 *   description: Custom conversion funnel analytics
 */

router.route('/')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), funnelController.getFunnels)
  .post(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createFunnelValidator, validate, funnelController.createFunnel);

router.route('/:funnelId')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), funnelController.getFunnelById)
  .put(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createFunnelValidator, validate, funnelController.updateFunnel)
  .delete(authorizeProjectRoles(ROLES.PROJECT_MANAGER), funnelController.deleteFunnel);

router.post('/:funnelId/calculate', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), 
  calculateFunnelValidator, validate, 
  funnelController.calculateFunnel
);

export default router;
