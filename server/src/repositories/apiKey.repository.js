import { ApiKey } from '../models/apiKey.model.js';

class ApiKeyRepository {
  async create(keyData) {
    const key = new ApiKey(keyData);
    return await key.save();
  }

  async findByPublicKey(publicKey) {
    return await ApiKey.findOne({ publicKey, status: 'active' }).populate('project');
  }

  async findByProject(projectId) {
    return await ApiKey.find({ project: projectId }).sort({ createdAt: -1 });
  }

  async findByIdAndProject(id, projectId) {
    return await ApiKey.findOne({ _id: id, project: projectId });
  }

  async revoke(id) {
    return await ApiKey.findByIdAndUpdate(id, { status: 'revoked' }, { new: true });
  }

  async recordUsage(id) {
    return await ApiKey.findByIdAndUpdate(
      id,
      { $inc: { usageCount: 1 }, $set: { lastUsedAt: new Date() } }
    );
  }
}

export default new ApiKeyRepository();
