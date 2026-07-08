import { Workspace } from '../models/workspace.model.js';

class WorkspaceRepository {
  async create(workspaceData) {
    const workspace = new Workspace(workspaceData);
    return await workspace.save();
  }

  async findById(id) {
    return await Workspace.findById(id).where({ deletedAt: null });
  }

  async findBySlug(slug, orgId) {
    return await Workspace.findOne({ slug, organization: orgId }).where({ deletedAt: null });
  }

  async updateById(id, updateData) {
    return await Workspace.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).where({ deletedAt: null });
  }

  async softDelete(id) {
    return await Workspace.findByIdAndUpdate(id, { deletedAt: new Date(), status: 'archived' }, { new: true });
  }

  async findByOrganization(orgId) {
    return await Workspace.find({ organization: orgId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async findByUser(userId) {
    return await Workspace.find({ members: userId, deletedAt: null }).sort({ createdAt: -1 });
  }
}

export default new WorkspaceRepository();
