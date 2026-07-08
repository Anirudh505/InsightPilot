import express from 'express';
import journeyController from '../controllers/journeys.controller.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: User Journeys
 *   description: Reconstructs individual user paths across sessions and devices
 */

router.get('/', authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), journeyController.getJourneys);
router.get('/:userId', authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), journeyController.getJourneyPath);

export default router;
