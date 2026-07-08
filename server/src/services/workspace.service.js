import workspaceRepository from '../repositories/workspace.repository.js';
import organizationMemberRepository from '../repositories/organizationMember.repository.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';

class WorkspaceService {
  async createWorkspace(userId, workspaceData) {
    // 1. Verify user belongs to the organization
    const membership = await organizationMemberRepository.findByUserAndOrg(userId, workspaceData.organization);
    if (!membership || membership.status !== 'active') {
      throw new ForbiddenError('You must be a member of the organization to create a workspace');
    }

    // 2. Check slug uniqueness within organization
    const existing = await workspaceRepository.findBySlug(workspaceData.slug, workspaceData.organization);
    if (existing) {
      throw new BadRequestError('Workspace slug is already taken within this organization');
    }

    const workspace = await workspaceRepository.create({
      ...workspaceData,
      owner: userId,
      members: [userId]
    });

    return workspace;
  }

  async getWorkspacesByOrg(orgId) {
    return await workspaceRepository.findByOrganization(orgId);
  }

  async getWorkspaceDetails(id) {
    const workspace = await workspaceRepository.findById(id);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }
    return workspace;
  }

  async updateWorkspace(id, updateData) {
    // Prevent updating critical unchangeable fields
    delete updateData.owner;
    delete updateData.organization;

    if (updateData.slug) {
      const workspace = await this.getWorkspaceDetails(id);
      const existing = await workspaceRepository.findBySlug(updateData.slug, workspace.organization);
      if (existing && existing._id.toString() !== id) {
        throw new BadRequestError('Workspace slug is already taken');
      }
    }

    const updated = await workspaceRepository.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundError('Workspace not found');
    }
    return updated;
  }
}

export default new WorkspaceService();
