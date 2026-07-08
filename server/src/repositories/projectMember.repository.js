import { ProjectMember } from '../models/projectMember.model.js';

class ProjectMemberRepository {
  async create(memberData) {
    const member = new ProjectMember(memberData);
    return await member.save();
  }

  async findById(memberId) {
    return await ProjectMember.findById(memberId).populate('user', 'fullName email avatar');
  }

  async findByUserAndProject(userId, projectId) {
    return await ProjectMember.findOne({ user: userId, project: projectId, status: 'active' });
  }

  async findByProject(projectId) {
    return await ProjectMember.find({ project: projectId, status: 'active' })
      .populate('user', 'fullName email avatar status')
      .sort({ createdAt: -1 });
  }

  async updateRole(memberId, role) {
    return await ProjectMember.findByIdAndUpdate(memberId, { role }, { new: true, runValidators: true });
  }

  async removeMember(memberId) {
    return await ProjectMember.findByIdAndUpdate(memberId, { status: 'left' }, { new: true });
  }
}

export default new ProjectMemberRepository();
