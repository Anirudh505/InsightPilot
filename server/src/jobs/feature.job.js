import featureRepository from '../repositories/feature.repository.js';
import logger from '../config/logger.config.js';

class FeatureJob {
  /**
   * Runs nightly to generate Feature Adoption Snapshots.
   * This reuses project DAU from Sprint 6 to calculate adoption %.
   */
  async generateDailyAdoptionSnapshots() {
    logger.info(`[Feature Job] Starting daily feature adoption snapshot generation...`);
    try {
      const { Feature } = await import('../models/feature.model.js');
      const features = await Feature.find({ isArchived: false, deletedAt: null });

      const now = new Date();
      // Calculate for yesterday to ensure full day of data
      const targetDate = new Date(now);
      targetDate.setUTCDate(targetDate.getUTCDate() - 1);
      targetDate.setUTCHours(0, 0, 0, 0);
      
      let processed = 0;
      for (const feature of features) {
        await featureRepository.calculateDailyFeatureAdoption(feature._id, targetDate);
        processed++;
      }
      
      logger.info(`[Feature Job] Completed adoption snapshots for ${processed} features.`);
    } catch (err) {
      logger.error(`[Feature Job] Daily snapshot generation failed`, err);
    }
  }
}

export default new FeatureJob();
