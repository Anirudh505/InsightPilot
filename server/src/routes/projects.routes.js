import express from 'express';
import projectController from '../controllers/projects.controller.js';
import apiKeyController from '../controllers/apiKeys.controller.js';
import projectMemberController from '../controllers/projectMembers.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createProjectValidator, updateProjectValidator, updateProjectSettingsValidator } from '../validators/project.validator.js';
import { createApiKeyValidator } from '../validators/apiKey.validator.js';
import { addProjectMemberValidator, updateProjectRoleValidator } from '../validators/projectMember.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project, API Key, and Member management
 */

// ==========================================
// Projects
// ==========================================

router.route('/')
  .get(projectController.getProjectsByWorkspace)
  .post(createProjectValidator, validate, projectController.createProject);

router.route('/:projectId')
  .get(projectController.getProjectDetails)
  .put(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER), updateProjectValidator, validate, projectController.updateProject);

router.patch('/:projectId/settings', authorizeProjectRoles(ROLES.PROJECT_MANAGER), updateProjectSettingsValidator, validate, projectController.updateProjectSettings);
router.post('/:projectId/archive', authorizeProjectRoles(ROLES.PROJECT_MANAGER), projectController.archiveProject);
router.post('/:projectId/restore', authorizeProjectRoles(ROLES.PROJECT_MANAGER), projectController.restoreProject);

// ==========================================
// API Keys
// ==========================================

router.route('/:projectId/api-keys')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER), apiKeyController.getProjectKeys)
  .post(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER), createApiKeyValidator, validate, apiKeyController.generateKey);

router.route('/:projectId/api-keys/:keyId')
  .delete(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER), apiKeyController.revokeKey);

// ==========================================
// Project Members
// ==========================================

router.route('/:projectId/members')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST, ROLES.DEVELOPER, ROLES.VIEWER), projectMemberController.getMembers)
  .post(authorizeProjectRoles(ROLES.PROJECT_MANAGER), addProjectMemberValidator, validate, projectMemberController.addMember);

router.route('/:projectId/members/:memberId')
  .put(authorizeProjectRoles(ROLES.PROJECT_MANAGER), updateProjectRoleValidator, validate, projectMemberController.updateRole)
  .delete(authorizeProjectRoles(ROLES.PROJECT_MANAGER), projectMemberController.removeMember);

export default router;
