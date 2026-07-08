import featureRepository from '../repositories/feature.repository.js';
import { NotFoundError } from '../utils/ApiError.js';

class FeatureService {
  async createFeature(projectId, workspaceId, userId, data) {
    return await featureRepository.create({
      ...data,
      project: projectId,
      workspace: workspaceId,
      createdBy: userId
    });
  }

  async getFeatures(projectId) {
    return await featureRepository.findByProject(projectId);
  }

  async getFeatureById(id, projectId) {
    const feature = await featureRepository.findById(id);
    if (!feature || feature.project.toString() !== projectId.toString()) {
      throw new NotFoundError('Feature not found');
    }
    return feature;
  }

  async updateFeature(id, projectId, data) {
    await this.getFeatureById(id, projectId);
    return await featureRepository.updateById(id, data);
  }

  async deleteFeature(id, projectId) {
    await this.getFeatureById(id, projectId);
    return await featureRepository.softDelete(id);
  }
}

export default new FeatureService();
