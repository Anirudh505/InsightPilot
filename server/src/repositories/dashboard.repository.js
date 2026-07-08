import { Dashboard } from '../models/dashboard.model.js';

class DashboardRepository {
  async create(data) {
    // If this is set as default, unset others first
    if (data.isDefault) {
      await Dashboard.updateMany({ project: data.project }, { isDefault: false });
    }
    const dashboard = new Dashboard(data);
    return await dashboard.save();
  }

  async findByProject(projectId) {
    return await Dashboard.find({ project: projectId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Dashboard.findById(id).where({ deletedAt: null });
  }

  async updateById(id, data) {
    if (data.isDefault) {
      const dashboard = await this.findById(id);
      if (dashboard) {
        await Dashboard.updateMany({ project: dashboard.project }, { isDefault: false });
      }
    }
    return await Dashboard.findByIdAndUpdate(id, data, { new: true }).where({ deletedAt: null });
  }

  async softDelete(id) {
    return await Dashboard.findByIdAndUpdate(id, { deletedAt: new Date(), isArchived: true });
  }

  // WIDGET MANAGEMENT
  async addWidget(dashboardId, widgetData) {
    return await Dashboard.findByIdAndUpdate(
      dashboardId,
      { $push: { widgets: widgetData } },
      { new: true }
    );
  }

  async updateWidget(dashboardId, widgetId, widgetData) {
    return await Dashboard.findOneAndUpdate(
      { _id: dashboardId, 'widgets._id': widgetId },
      { $set: { 'widgets.$': widgetData } },
      { new: true }
    );
  }

  async removeWidget(dashboardId, widgetId) {
    return await Dashboard.findByIdAndUpdate(
      dashboardId,
      { $pull: { widgets: { _id: widgetId } } },
      { new: true }
    );
  }

  async updateLayout(dashboardId, layoutUpdates) {
    // layoutUpdates is an array of { _id: widgetId, layout: { x, y, w, h } }
    const dashboard = await this.findById(dashboardId);
    if (!dashboard) return null;

    layoutUpdates.forEach(update => {
      const widget = dashboard.widgets.id(update._id);
      if (widget) {
        widget.layout = { ...widget.layout, ...update.layout };
      }
    });

    return await dashboard.save();
  }
}

export default new DashboardRepository();
