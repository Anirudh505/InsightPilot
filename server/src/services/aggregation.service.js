import analyticsRepository from '../repositories/analytics.repository.js';
import projectRepository from '../repositories/project.repository.js';
import logger from '../config/logger.config.js';

class AggregationService {
  
  /**
   * Runs hourly to compute the previous hour's stats.
   */
  async processHourlyRollup(date = new Date()) {
    // Floor to previous hour
    const endOfHour = new Date(date);
    endOfHour.setMinutes(0, 0, 0);
    const startOfHour = new Date(endOfHour.getTime() - 60 * 60 * 1000);

    logger.info(`Starting Hourly Aggregation for ${startOfHour.toISOString()}`);

    // We should iterate over active projects.
    // In a massive scale system, this would be chunked/paginated or handled via map-reduce.
    const projects = await projectRepository.Project.find({ status: 'active' }).select('_id workspace');

    let processed = 0;
    for (const project of projects) {
      try {
        const data = await analyticsRepository.buildHourlyAggregation(project._id, startOfHour, endOfHour);
        if (data.totalEvents > 0 || data.totalSessions > 0) {
           await analyticsRepository.saveHourlyAnalytics(project._id, project.workspace, startOfHour, data);
           processed++;
        }
      } catch (err) {
        logger.error(`Error processing hourly rollup for project ${project._id}`, err);
      }
    }

    logger.info(`Hourly Aggregation completed. Processed ${processed} projects.`);
  }

  /**
   * Runs daily (e.g. at 00:15 UTC) to compute the previous day's stats.
   */
  async processDailyRollup(date = new Date()) {
    // Floor to previous day
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(0, 0, 0, 0);
    const startOfDay = new Date(endOfDay.getTime() - 24 * 60 * 60 * 1000);

    logger.info(`Starting Daily Aggregation for ${startOfDay.toISOString()}`);

    const projects = await projectRepository.Project.find({ status: 'active' }).select('_id workspace');

    let processed = 0;
    for (const project of projects) {
      try {
        const data = await analyticsRepository.buildDailyAggregation(project._id, startOfDay, endOfDay);
        if (data) {
           await analyticsRepository.saveDailyAnalytics(project._id, project.workspace, startOfDay, data);
           processed++;
        }
      } catch (err) {
        logger.error(`Error processing daily rollup for project ${project._id}`, err);
      }
    }

    logger.info(`Daily Aggregation completed. Processed ${processed} projects.`);
  }
}

// We need to bypass the standard export new ProjectRepo() due to circular dependencies in initialization sometimes.
// So we just import the model directly in AggregationService for brevity of finding projects.
import { Project } from '../models/project.model.js';
projectRepository.Project = Project; 

export default new AggregationService();
