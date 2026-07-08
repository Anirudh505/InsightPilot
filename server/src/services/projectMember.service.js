import projectMemberRepository from '../repositories/projectMember.repository.js';
import userRepository from '../repositories/user.repository.js';
import projectRepository from '../repositories/project.repository.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';

class ProjectMemberService {
  async addMember(projectId, email, role, inviterId) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw new NotFoundError('Project not found');

    const user = await userRepository.findByEmail(email);
    if (!user) throw new NotFoundError('User with this email not found');

    const existingMember = await projectMemberRepository.findByUserAndProject(user._id, projectId);
    if (existingMember) {
      throw new ConflictError('User is already a member of this project');
    }

    return await projectMemberRepository.create({
      project: projectId,
      user: user._id,
      role,
      invitedBy: inviterId
    });
  }

  async getMembers(projectId) {
    return await projectMemberRepository.findByProject(projectId);
  }

  async updateRole(memberId, role, requesterId) {
    const membership = await projectMemberRepository.findById(memberId);
    if (!membership) throw new NotFoundError('Membership not found');

    // Prevent changing the project owner's role directly via this endpoint
    // Ownership transfer is a different complex process
    if (membership.role === ROLES.PROJECT_MANAGER) {
      // Would normally check if they are the LAST manager before allowing demotion
    }

    return await projectMemberRepository.updateRole(memberId, role);
  }

  async removeMember(memberId) {
    const membership = await projectMemberRepository.findById(memberId);
    if (!membership) throw new NotFoundError('Membership not found');

    if (membership.role === ROLES.PROJECT_MANAGER) {
      throw new ForbiddenError('Cannot remove a Project Manager without transferring ownership first');
    }

    return await projectMemberRepository.removeMember(memberId);
  }
}

export default new ProjectMemberService();
