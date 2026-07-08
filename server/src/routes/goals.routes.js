import express from 'express';
import goalController from '../controllers/goals.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createGoalValidator } from '../validators/goal.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

router.route('/')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), goalController.getGoals)
  .post(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createGoalValidator, validate, goalController.createGoal);

export default router;
