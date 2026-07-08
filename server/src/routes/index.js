import express from 'express';
import healthRoutes from './health.routes.js';

// Placeholder imports for future domain routes
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import organizationsRoutes from './organizations.routes.js';
import workspacesRoutes from './workspaces.routes.js';
import projectsRoutes from './projects.routes.js';
import eventsRoutes from './events.routes.js';
import funnelsRoutes from './funnels.routes.js';
import goalsRoutes from './goals.routes.js';
import journeysRoutes from './journeys.routes.js';
import cohortsRoutes from './cohorts.routes.js';
import retentionRoutes from './retention.routes.js';
import featuresRoutes from './features.routes.js';
import segmentsRoutes from './segments.routes.js';
import aiRoutes from './ai.routes.js';
import dashboardsRoutes from './dashboards.routes.js';
import reportsRoutes from './reports.routes.js';
import notificationsRoutes from './notifications.routes.js';
import adminRoutes from './admin.routes.js';
import analyticsRoutes from './analytics.routes.js';
import subscriptionsRoutes from './subscriptions.routes.js';

const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the InsightPilot API',
    version: '1.0.0'
  });
});

// Mount health routes
router.use('/', healthRoutes);

// Mount domain routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/workspaces', workspacesRoutes);
router.use('/projects', projectsRoutes);
router.use('/events', eventsRoutes);
router.use('/projects/:projectId/funnels', funnelsRoutes);
router.use('/projects/:projectId/goals', goalsRoutes);
router.use('/projects/:projectId/journeys', journeysRoutes);
router.use('/projects/:projectId/cohorts', cohortsRoutes);
router.use('/projects/:projectId/retention', retentionRoutes);
router.use('/projects/:projectId/features', featuresRoutes);
router.use('/projects/:projectId/segments', segmentsRoutes);
router.use('/projects/:projectId/ai', aiRoutes);
router.use('/projects/:projectId/dashboards', dashboardsRoutes);
router.use('/reports', reportsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/subscriptions', subscriptionsRoutes);

export default router;
