import organizationRepository from '../repositories/organization.repository.js';
import organizationMemberRepository from '../repositories/organizationMember.repository.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';

class OrganizationService {
  async createOrganization(userId, orgData) {
    // Check if slug is unique
    const existingOrg = await organizationRepository.findBySlug(orgData.slug);
    if (existingOrg) {
      throw new BadRequestError('Organization slug is already taken');
    }

    // 1. Create the organization
    const org = await organizationRepository.create({
      ...orgData,
      owner: userId,
      membersCount: 1, // Owner is the first member
    });

    // 2. Add creator as OWNER in the pivot table
    await organizationMemberRepository.create({
      organization: org._id,
      user: userId,
      role: ROLES.OWNER,
      // Owners get all permissions implicitly, or define them explicitly
    });

    return org;
  }

  async getOrganizationDetails(orgId) {
    const org = await organizationRepository.findById(orgId);
    if (!org) {
      throw new NotFoundError('Organization not found');
    }
    return org;
  }

  async getUserOrganizations(userId) {
    return await organizationMemberRepository.findOrgsByUser(userId);
  }

  async updateOrganization(orgId, updateData, userId) {
    // Only verify authorization if we implement strict role checks here, 
    // but ideally, controllers/middleware handle authZ before calling service.
    
    // Prevent updating restricted fields
    delete updateData.owner;
    delete updateData.subscriptionPlan;
    delete updateData.membersCount;

    if (updateData.slug) {
      const existing = await organizationRepository.findBySlug(updateData.slug);
      if (existing && existing._id.toString() !== orgId) {
        throw new BadRequestError('Slug is already in use by another organization');
      }
    }

    const updatedOrg = await organizationRepository.updateById(orgId, updateData);
    if (!updatedOrg) {
      throw new NotFoundError('Organization not found');
    }
    return updatedOrg;
  }

  async getOrganizationMembers(orgId, skip = 0, limit = 50) {
    return await organizationMemberRepository.findUsersByOrg(orgId, skip, limit);
  }

  async removeMember(orgId, targetUserId, requesterId) {
    const membership = await organizationMemberRepository.findByUserAndOrg(targetUserId, orgId);
    if (!membership) {
      throw new NotFoundError('User is not a member of this organization');
    }

    // Cannot remove the owner
    if (membership.role === ROLES.OWNER) {
      throw new ForbiddenError('Cannot remove the organization owner');
    }

    await organizationMemberRepository.removeMember(membership._id);
    await organizationRepository.incrementMembersCount(orgId, -1);

    return true;
  }
}

export default new OrganizationService();
