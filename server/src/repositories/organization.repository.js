import { Organization } from '../models/organization.model.js';

class OrganizationRepository {
  async create(orgData) {
    const org = new Organization(orgData);
    return await org.save();
  }

  async findById(orgId) {
    return await Organization.findById(orgId);
  }

  async findBySlug(slug) {
    return await Organization.findOne({ slug });
  }

  async updateById(orgId, updateData) {
    return await Organization.findByIdAndUpdate(orgId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(orgId) {
    return await Organization.findByIdAndDelete(orgId);
  }

  async findManyByOwnerId(ownerId) {
    return await Organization.find({ owner: ownerId }).sort({ createdAt: -1 });
  }

  async incrementMembersCount(orgId, value = 1) {
    return await Organization.findByIdAndUpdate(
      orgId,
      { $inc: { membersCount: value } },
      { new: true }
    );
  }

  async incrementProjectsCount(orgId, value = 1) {
    return await Organization.findByIdAndUpdate(
      orgId,
      { $inc: { projectsCount: value } },
      { new: true }
    );
  }
}

export default new OrganizationRepository();
