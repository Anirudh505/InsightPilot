import express from 'express';
import cohortController from '../controllers/cohorts.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createCohortValidator } from '../validators/cohort.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Cohorts
 *   description: Dynamic user grouping and behavioral cohorts
 */

router.route('/')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), cohortController.getCohorts)
  .post(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createCohortValidator, validate, cohortController.createCohort);

router.route('/:cohortId')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), cohortController.getCohortById)
  .put(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createCohortValidator, validate, cohortController.updateCohort)
  .delete(authorizeProjectRoles(ROLES.PROJECT_MANAGER), cohortController.deleteCohort);

router.post('/:cohortId/calculate', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), 
  cohortController.calculateCohort
);

export default router;
