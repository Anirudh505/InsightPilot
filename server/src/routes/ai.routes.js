import express from 'express';
import aiController from '../controllers/ai.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { chatValidator } from '../validators/ai.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: AI Copilot
 *   description: Automated insights and natural language querying
 */

router.get('/insights', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  aiController.getInsights
);

router.post('/copilot/chat', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  chatValidator, validate, 
  aiController.chat
);

router.get('/copilot/history', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  aiController.getChatHistory
);

export default router;
