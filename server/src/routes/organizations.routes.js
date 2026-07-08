import express from 'express';
import organizationController from '../controllers/organizations.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createOrganizationValidator, updateOrganizationValidator } from '../validators/organization.validator.js';
import { inviteUserValidator, acceptInviteValidator, inviteIdParamValidator } from '../validators/invite.validator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization and member management
 */

// Global invites endpoint (doesn't require a specific orgId in the URL)
router.post('/invites/accept', acceptInviteValidator, validate, organizationController.acceptInvite);

// Organization Core Routes
router.route('/')
  .get(organizationController.getUserOrganizations)
  .post(createOrganizationValidator, validate, organizationController.createOrganization);

router.route('/:orgId')
  .get(organizationController.getOrganizationDetails)
  .put(updateOrganizationValidator, validate, organizationController.updateOrganization);

// Organization Members
router.route('/:orgId/members')
  .get(organizationController.getMembers);

router.route('/:orgId/members/:userId')
  .delete(organizationController.removeMember);

// Organization Invites
router.route('/:orgId/invites')
  .get(organizationController.getPendingInvites)
  .post(inviteUserValidator, validate, organizationController.inviteUser);

router.route('/:orgId/invites/:inviteId')
  .delete(inviteIdParamValidator, validate, organizationController.revokeInvite);

export default router;
