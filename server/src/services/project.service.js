import projectRepository from '../repositories/project.repository.js';
import projectMemberRepository from '../repositories/projectMember.repository.js';
import workspaceRepository from '../repositories/workspace.repository.js';
import { NotFoundError, BadRequestError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';

class ProjectService {
  async createProject(userId, projectData) {
    // Verify Workspace exists
    const workspace = await workspaceRepository.findById(projectData.workspace);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    // Check slug uniqueness inside the workspace
    const existing = await projectRepository.findBySlugAndWorkspace(projectData.slug, projectData.workspace);
    if (existing) {
      throw new BadRequestError('Project slug is already taken within this workspace');
    }

    const project = await projectRepository.create({
      ...projectData,
      owner: userId
    });

    // Auto-add creator as Project Manager
    await projectMemberRepository.create({
      project: project._id,
      user: userId,
      role: ROLES.PROJECT_MANAGER
    });

    return project;
  }

  async getProjectsByWorkspace(workspaceId) {
    return await projectRepository.findByWorkspace(workspaceId);
  }

  async getProjectDetails(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    return project;
  }

  async updateProject(id, updateData) {
    delete updateData.owner;
    delete updateData.workspace;

    if (updateData.slug) {
      const project = await this.getProjectDetails(id);
      const existing = await projectRepository.findBySlugAndWorkspace(updateData.slug, project.workspace);
      if (existing && existing._id.toString() !== id) {
        throw new BadRequestError('Project slug is already taken in this workspace');
      }
    }

    const updated = await projectRepository.updateById(id, updateData);
    if (!updated) {
      throw new NotFoundError('Project not found');
    }
    return updated;
  }

  async updateProjectSettings(id, settings) {
    const updated = await projectRepository.updateSettings(id, settings);
    if (!updated) {
      throw new NotFoundError('Project not found');
    }
    return updated;
  }

  async archiveProject(id) {
    const updated = await projectRepository.archive(id);
    if (!updated) {
      throw new NotFoundError('Project not found');
    }
    return updated;
  }

  async restoreProject(id) {
    const updated = await projectRepository.restore(id);
    if (!updated) {
      throw new NotFoundError('Project not found');
    }
    return updated;
  }
}

export default new ProjectService();
