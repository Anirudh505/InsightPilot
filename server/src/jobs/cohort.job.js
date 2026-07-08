import cohortRepository from '../repositories/cohort.repository.js';
import logger from '../config/logger.config.js';

class CohortJob {
  /**
   * Processes a cohort calculation asynchronously.
   */
  async triggerCalculation(cohortId) {
    logger.info(`[Cohort Job] Queueing calculation for cohort ${cohortId}`);
    
    await cohortRepository.setCalculationStatus(cohortId, 'calculating');

    setTimeout(async () => {
      try {
        const start = Date.now();
        const result = await cohortRepository.calculateCohortUsers(cohortId);
        
        if (result) {
          await cohortRepository.updateCalculationResult(cohortId, result);
          logger.info(`[Cohort Job] Completed calculation for ${cohortId} in ${Date.now() - start}ms`);
        } else {
          await cohortRepository.setCalculationStatus(cohortId, 'failed');
        }
      } catch (err) {
        logger.error(`[Cohort Job] Failed calculation for cohort ${cohortId}`, err);
        await cohortRepository.setCalculationStatus(cohortId, 'failed');
      }
    }, 100); 
  }

  /**
   * Refreshes all dynamic cohorts nightly.
   */
  async refreshDynamicCohorts() {
    logger.info(`[Cohort Job] Starting nightly refresh of dynamic cohorts`);
    try {
      // Find all dynamic cohorts
      const { Cohort } = await import('../models/cohort.model.js');
      const dynamicCohorts = await Cohort.find({ isDynamic: true, isArchived: false, deletedAt: null });
      
      for (const cohort of dynamicCohorts) {
        await this.triggerCalculation(cohort._id);
      }
      logger.info(`[Cohort Job] Queued ${dynamicCohorts.length} cohorts for refresh.`);
    } catch (err) {
      logger.error(`[Cohort Job] Nightly refresh failed`, err);
    }
  }
}

export default new CohortJob();
