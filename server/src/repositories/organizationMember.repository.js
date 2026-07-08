import { OrganizationMember } from '../models/organizationMember.model.js';

class OrganizationMemberRepository {
  async create(memberData) {
    const member = new OrganizationMember(memberData);
    return await member.save();
  }

  async findById(memberId) {
    return await OrganizationMember.findById(memberId)
      .populate('user', 'fullName email avatar')
      .populate('organization', 'companyName slug');
  }

  async findByUserAndOrg(userId, orgId) {
    return await OrganizationMember.findOne({ user: userId, organization: orgId });
  }

  async findUsersByOrg(orgId, skip = 0, limit = 50) {
    return await OrganizationMember.find({ organization: orgId, status: 'active' })
      .populate('user', 'fullName email avatar status lastLogin')
      .skip(skip)
      .limit(limit)
      .sort({ joinedAt: -1 });
  }

  async findOrgsByUser(userId) {
    return await OrganizationMember.find({ user: userId, status: 'active' })
      .populate('organization', 'companyName slug logo subscriptionPlan membersCount');
  }

  async updateRole(memberId, role, permissions) {
    return await OrganizationMember.findByIdAndUpdate(
      memberId,
      { role, permissions },
      { new: true, runValidators: true }
    );
  }

  async removeMember(memberId) {
    return await OrganizationMember.findByIdAndUpdate(
      memberId,
      { status: 'left' },
      { new: true }
    );
  }
}

export default new OrganizationMemberRepository();
