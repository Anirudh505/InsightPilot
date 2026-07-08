import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import dashboardService from '../services/dashboard.service.js';
import realtimeService from '../services/realtime.service.js';

class DashboardController {
  
  // DASHBOARD MANAGEMENT
  createDashboard = AsyncHandler(async (req, res) => {
    const workspaceId = req.projectMembership.project.workspace || req.body.workspaceId;
    const dashboard = await dashboardService.createDashboard(req.params.projectId, workspaceId, req.user._id, req.body);
    res.status(201).json(new ApiResponse(201, dashboard, 'Dashboard created successfully'));
  });

  getDashboards = AsyncHandler(async (req, res) => {
    const dashboards = await dashboardService.getDashboards(req.params.projectId);
    res.status(200).json(new ApiResponse(200, dashboards, 'Dashboards fetched'));
  });

  getDashboardById = AsyncHandler(async (req, res) => {
    const dashboard = await dashboardService.getDashboardById(req.params.dashboardId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard fetched'));
  });

  updateDashboard = AsyncHandler(async (req, res) => {
    const dashboard = await dashboardService.updateDashboard(req.params.dashboardId, req.params.projectId, req.body);
    res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard updated'));
  });

  deleteDashboard = AsyncHandler(async (req, res) => {
    await dashboardService.deleteDashboard(req.params.dashboardId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, null, 'Dashboard archived'));
  });

  // DATA AGGREGATION
  getDashboardOverview = AsyncHandler(async (req, res) => {
    // This resolves all widgets and their underlying data in a single request
    const overview = await dashboardService.getDashboardOverview(req.params.dashboardId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, overview, 'Dashboard overview fetched'));
  });

  getRealtimeOverview = AsyncHandler(async (req, res) => {
    const realtime = await realtimeService.getRealtimeOverview(req.params.projectId);
    res.status(200).json(new ApiResponse(200, realtime, 'Realtime metrics fetched'));
  });

  // WIDGET MANAGEMENT
  addWidget = AsyncHandler(async (req, res) => {
    const dashboard = await dashboardService.addWidget(req.params.dashboardId, req.params.projectId, req.body);
    res.status(201).json(new ApiResponse(201, dashboard, 'Widget added'));
  });

  updateWidget = AsyncHandler(async (req, res) => {
    const dashboard = await dashboardService.updateWidget(req.params.dashboardId, req.params.projectId, req.params.widgetId, req.body);
    res.status(200).json(new ApiResponse(200, dashboard, 'Widget updated'));
  });

  removeWidget = AsyncHandler(async (req, res) => {
    const dashboard = await dashboardService.removeWidget(req.params.dashboardId, req.params.projectId, req.params.widgetId);
    res.status(200).json(new ApiResponse(200, dashboard, 'Widget removed'));
  });

  updateLayout = AsyncHandler(async (req, res) => {
    const dashboard = await dashboardService.updateLayout(req.params.dashboardId, req.params.projectId, req.body.updates);
    res.status(200).json(new ApiResponse(200, dashboard, 'Layout updated'));
  });
}

export default new DashboardController();
