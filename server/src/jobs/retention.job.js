import retentionRepository from '../repositories/retention.repository.js';
import logger from '../config/logger.config.js';

class RetentionJob {
  /**
   * Runs nightly to generate Retention Snapshots for active projects.
   * Calculates retention for cohorts created over the last 30 days.
   */
  async generateDailyRetentionSnapshots() {
    logger.info(`[Retention Job] Starting daily snapshot generation...`);
    try {
      const { Project } = await import('../models/project.model.js');
      const projects = await Project.find({ status: 'active' }).select('_id workspace');

      const now = new Date();
      // We look back over the last 30 days and update the retention matrices for those cohorts.
      // (e.g. A cohort from 14 days ago needs its Day 14 retention checked today).
      
      let processed = 0;
      for (const project of projects) {
        // Iterate backwards over the last 30 days
        for (let i = 0; i < 30; i++) {
          const targetDate = new Date(now);
          targetDate.setUTCDate(targetDate.getUTCDate() - i);
          targetDate.setUTCHours(0, 0, 0, 0);

          // Calculate generic retention
          await retentionRepository.calculateDailyRetention(project._id, project.workspace, targetDate);
        }
        processed++;
      }
      
      logger.info(`[Retention Job] Completed retention snapshots for ${processed} projects.`);
    } catch (err) {
      logger.error(`[Retention Job] Daily snapshot generation failed`, err);
    }
  }
}

export default new RetentionJob();
