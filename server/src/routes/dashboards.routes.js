import express from 'express';
import dashboardController from '../controllers/dashboards.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createDashboardValidator, widgetValidator, layoutUpdateValidator } from '../validators/dashboard.validator.js';
import { authenticateUser, authorizeProjectRoles } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router({ mergeParams: true });

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Dashboards
 *   description: Dynamic layout and widget engine
 */

// GLOBAL REALTIME (Not tied to a specific dashboard)
router.get('/realtime', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  dashboardController.getRealtimeOverview
);

// CRUD
router.route('/')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), dashboardController.getDashboards)
  .post(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createDashboardValidator, validate, dashboardController.createDashboard);

router.route('/:dashboardId')
  .get(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), dashboardController.getDashboardById)
  .put(authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), createDashboardValidator, validate, dashboardController.updateDashboard)
  .delete(authorizeProjectRoles(ROLES.PROJECT_MANAGER), dashboardController.deleteDashboard);

// AGGREGATION GATEWAY
router.get('/:dashboardId/overview', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.DEVELOPER, ROLES.ANALYST, ROLES.VIEWER), 
  dashboardController.getDashboardOverview
);

// WIDGET MANAGEMENT
router.post('/:dashboardId/widgets', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), 
  widgetValidator, validate, 
  dashboardController.addWidget
);

router.put('/:dashboardId/widgets/:widgetId', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), 
  widgetValidator, validate, 
  dashboardController.updateWidget
);

router.delete('/:dashboardId/widgets/:widgetId', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), 
  dashboardController.removeWidget
);

router.put('/:dashboardId/layout', 
  authorizeProjectRoles(ROLES.PROJECT_MANAGER, ROLES.ANALYST), 
  layoutUpdateValidator, validate, 
  dashboardController.updateLayout
);

export default router;
