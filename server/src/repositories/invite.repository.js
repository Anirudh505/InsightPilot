import { Invite } from '../models/invite.model.js';

class InviteRepository {
  async create(inviteData) {
    const invite = new Invite(inviteData);
    return await invite.save();
  }

  async findByToken(token) {
    return await Invite.findOne({ token, accepted: false })
      .populate('organization', 'companyName slug logo')
      .populate('createdBy', 'fullName email');
  }

  async findByEmailAndOrg(email, orgId) {
    return await Invite.findOne({ email, organization: orgId, accepted: false });
  }

  async markAsAccepted(inviteId) {
    return await Invite.findByIdAndUpdate(
      inviteId,
      { accepted: true },
      { new: true }
    );
  }

  async deleteById(inviteId) {
    return await Invite.findByIdAndDelete(inviteId);
  }

  async findPendingByOrg(orgId) {
    return await Invite.find({ organization: orgId, accepted: false })
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });
  }
}

export default new InviteRepository();
