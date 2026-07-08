import { Project } from '../models/project.model.js';

class ProjectRepository {
  async create(projectData) {
    const project = new Project(projectData);
    return await project.save();
  }

  async findById(id) {
    return await Project.findById(id).where({ deletedAt: null });
  }

  async findBySlugAndWorkspace(slug, workspaceId) {
    return await Project.findOne({ slug, workspace: workspaceId }).where({ deletedAt: null });
  }

  async findByWorkspace(workspaceId) {
    return await Project.find({ workspace: workspaceId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async updateById(id, updateData) {
    return await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).where({ deletedAt: null });
  }

  async updateSettings(id, settingsUpdate) {
    return await Project.findByIdAndUpdate(
      id,
      { $set: { settings: settingsUpdate } },
      { new: true, runValidators: true }
    ).where({ deletedAt: null });
  }

  async archive(id) {
    return await Project.findByIdAndUpdate(id, { status: 'archived', archivedAt: new Date() }, { new: true });
  }

  async restore(id) {
    return await Project.findByIdAndUpdate(id, { status: 'active', archivedAt: null }, { new: true });
  }

  async softDelete(id) {
    return await Project.findByIdAndUpdate(id, { deletedAt: new Date(), status: 'archived' }, { new: true });
  }
}

export default new ProjectRepository();
