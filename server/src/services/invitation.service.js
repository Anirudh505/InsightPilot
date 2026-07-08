import crypto from 'crypto';
import inviteRepository from '../repositories/invite.repository.js';
import organizationRepository from '../repositories/organization.repository.js';
import organizationMemberRepository from '../repositories/organizationMember.repository.js';
import userRepository from '../repositories/user.repository.js';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/ApiError.js';

class InvitationService {
  async inviteUser(orgId, inviterId, email, role) {
    const org = await organizationRepository.findById(orgId);
    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    // Check if user is already a member
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const isMember = await organizationMemberRepository.findByUserAndOrg(existingUser._id, orgId);
      if (isMember && isMember.status === 'active') {
        throw new ConflictError('User is already a member of this organization');
      }
    }

    // Check if an active invite already exists
    const existingInvite = await inviteRepository.findByEmailAndOrg(email, orgId);
    if (existingInvite) {
      // If expired, delete it and create a new one, else throw
      if (new Date() < new Date(existingInvite.expiry)) {
        throw new ConflictError('An active invitation has already been sent to this email');
      } else {
        await inviteRepository.deleteById(existingInvite._id);
      }
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // 7 days expiry

    const invite = await inviteRepository.create({
      email,
      role,
      organization: orgId,
      expiry,
      token,
      createdBy: inviterId,
    });

    // TODO: Emit event to NotificationService to send email containing `token`
    // eventEmitter.emit('SEND_INVITE_EMAIL', { email, token, orgName: org.companyName });

    return invite;
  }

  async validateInviteToken(token) {
    const invite = await inviteRepository.findByToken(token);
    if (!invite) {
      throw new BadRequestError('Invalid or expired invitation token');
    }
    
    if (new Date() > new Date(invite.expiry)) {
      throw new BadRequestError('Invitation has expired');
    }

    return invite;
  }

  async acceptInvitation(token, userId) {
    const invite = await this.validateInviteToken(token);
    
    const user = await userRepository.findById(userId);
    if (user.email !== invite.email) {
      throw new BadRequestError('Invitation email does not match registered user email');
    }

    // Ensure not already a member
    const existingMembership = await organizationMemberRepository.findByUserAndOrg(userId, invite.organization._id);
    if (existingMembership && existingMembership.status === 'active') {
      await inviteRepository.markAsAccepted(invite._id); // Cleanup
      throw new ConflictError('You are already a member of this organization');
    }

    // Create membership
    await organizationMemberRepository.create({
      organization: invite.organization._id,
      user: userId,
      role: invite.role,
      invitedBy: invite.createdBy._id,
    });

    await organizationRepository.incrementMembersCount(invite.organization._id, 1);
    await inviteRepository.markAsAccepted(invite._id);

    return { success: true, organizationId: invite.organization._id };
  }

  async getPendingInvites(orgId) {
    return await inviteRepository.findPendingByOrg(orgId);
  }

  async revokeInvite(inviteId) {
    const invite = await inviteRepository.deleteById(inviteId);
    if (!invite) {
      throw new NotFoundError('Invite not found');
    }
    return true;
  }
}

export default new InvitationService();
