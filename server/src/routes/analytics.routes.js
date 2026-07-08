import express from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { analyticsQueryValidator } from '../validators/analytics.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics Processing
 *   description: High-performance aggregated analytics reporting
 */

router.use(authenticateUser);

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get high-level analytical overview (DAU, Sessions, Bounce Rate)
 *     tags: [Analytics Processing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [today, yesterday, 7d, 30d, 90d]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Analytical payload returned successfully
 */
router.get(
  '/overview', 
  analyticsQueryValidator, 
  validate, 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  analyticsController.getOverview
);

/**
 * @swagger
 * /analytics/events:
 *   get:
 *     summary: Get Top Events distribution
 *     tags: [Analytics Processing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [today, yesterday, 7d, 30d, 90d]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Top events returned
 */
router.get(
  '/events', 
  analyticsQueryValidator, 
  validate, 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  analyticsController.getEventsDistribution
);

// Other endpoints (users, sessions, technology, geography) would follow similar patterns
// leveraging the DailyAnalytics Maps.

export default router;
