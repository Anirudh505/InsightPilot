import express from 'express';
import workspaceController from '../controllers/workspaces.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createWorkspaceValidator, updateWorkspaceValidator } from '../validators/workspace.validator.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Workspaces
 *   description: Workspace management
 */

router.use(authenticateUser);

/**
 * @swagger
 * /workspaces:
 *   get:
 *     summary: Get all workspaces for an organization
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of workspaces
 */
router.route('/')
  .get(workspaceController.getWorkspacesByOrg)
  .post(createWorkspaceValidator, validate, workspaceController.createWorkspace);

router.route('/:workspaceId')
  .get(workspaceController.getWorkspaceDetails)
  .put(updateWorkspaceValidator, validate, workspaceController.updateWorkspace);

export default router;
