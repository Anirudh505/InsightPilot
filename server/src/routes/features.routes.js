import express from 'express';
import featureController from '../controllers/features.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createFeatureValidator, getAdoptionValidator } from '../validators/feature.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Features
 *   description: Feature definition and adoption metrics
 */

router.route('/')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), featureController.getFeatures)
  .post(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createFeatureValidator, validate, featureController.createFeature);

router.route('/:featureId')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), featureController.getFeatureById)
  .put(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createFeatureValidator, validate, featureController.updateFeature)
  .delete(authorizeProjectRoles(ROLES.PROJECT_MANAGER), featureController.deleteFeature);

router.get('/:featureId/adoption', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  getAdoptionValidator, validate, 
  featureController.getAdoption
);

export default router;
