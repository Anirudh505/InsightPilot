import express from 'express';
import userController from '../controllers/users.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateProfileValidator, updateNotificationSettingsValidator } from '../validators/user.validator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

// Note: In a real app, an authentication middleware (e.g., `protect`) would be added to these routes

router.route('/me')
  .get(userController.getProfile)
  .put(updateProfileValidator, validate, userController.updateProfile)
  .delete(userController.deactivateAccount);

router.route('/me/notifications')
  .patch(updateNotificationSettingsValidator, validate, userController.updateNotificationSettings);

export default router;
