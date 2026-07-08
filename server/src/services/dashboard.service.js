import dashboardRepository from '../repositories/dashboard.repository.js';
import widgetService from './widget.service.js';
import { NotFoundError } from '../utils/ApiError.js';

class DashboardService {
  async createDashboard(projectId, workspaceId, userId, data) {
    return await dashboardRepository.create({
      ...data,
      project: projectId,
      workspace: workspaceId,
      createdBy: userId
    });
  }

  async getDashboards(projectId) {
    return await dashboardRepository.findByProject(projectId);
  }

  async getDashboardById(id, projectId) {
    const dashboard = await dashboardRepository.findById(id);
    if (!dashboard || dashboard.project.toString() !== projectId.toString()) {
      throw new NotFoundError('Dashboard not found');
    }
    return dashboard;
  }

  async updateDashboard(id, projectId, data) {
    await this.getDashboardById(id, projectId);
    return await dashboardRepository.updateById(id, data);
  }

  async deleteDashboard(id, projectId) {
    await this.getDashboardById(id, projectId);
    return await dashboardRepository.softDelete(id);
  }

  /**
   * The core aggregator function. Fetches the dashboard and resolves
   * all the data required for its widgets in a single pass.
   */
  async getDashboardOverview(id, projectId) {
    const dashboard = await this.getDashboardById(id, projectId);
    
    // Resolve all widgets in parallel
    const resolvedWidgets = await Promise.all(
      dashboard.widgets.map(async (widget) => {
        try {
          const data = await widgetService.resolveWidgetData(projectId, widget);
          return {
            ...widget.toObject(),
            data // Injects the actual analytics payload
          };
        } catch (err) {
          // If a single widget fails, don't crash the whole dashboard
          return {
            ...widget.toObject(),
            data: { error: 'Failed to load widget data' }
          };
        }
      })
    );

    return {
      ...dashboard.toObject(),
      widgets: resolvedWidgets
    };
  }

  // WIDGET PROXIES
  async addWidget(id, projectId, widgetData) {
    await this.getDashboardById(id, projectId);
    return await dashboardRepository.addWidget(id, widgetData);
  }

  async updateWidget(id, projectId, widgetId, widgetData) {
    await this.getDashboardById(id, projectId);
    return await dashboardRepository.updateWidget(id, widgetId, widgetData);
  }

  async removeWidget(id, projectId, widgetId) {
    await this.getDashboardById(id, projectId);
    return await dashboardRepository.removeWidget(id, widgetId);
  }

  async updateLayout(id, projectId, layoutUpdates) {
    await this.getDashboardById(id, projectId);
    return await dashboardRepository.updateLayout(id, layoutUpdates);
  }
}

export default new DashboardService();
