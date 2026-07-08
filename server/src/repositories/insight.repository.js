import { Insight } from '../models/insight.model.js';
import logger from '../config/logger.config.js';

class InsightRepository {
  async create(data) {
    const insight = new Insight(data);
    return await insight.save();
  }

  async findByProject(projectId, limit = 50) {
    return await Insight.find({ project: projectId, deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findById(id) {
    return await Insight.findById(id).where({ deletedAt: null });
  }

  async softDelete(id) {
    return await Insight.findByIdAndUpdate(id, { deletedAt: new Date(), isArchived: true });
  }

  /**
   * Adds an AI generated recommendation to an existing insight
   */
  async addRecommendation(insightId, recommendation) {
    return await Insight.findByIdAndUpdate(
      insightId,
      { $push: { recommendations: recommendation } },
      { new: true }
    );
  }
}

export default new InsightRepository();
