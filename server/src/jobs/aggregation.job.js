import cron from 'node-cron';
import aggregationService from '../services/aggregation.service.js';
import cohortJob from './cohort.job.js';
import retentionJob from './retention.job.js';
import featureJob from './feature.job.js';
import segmentJob from './segment.job.js';
import aiJob from './ai.job.js';
import logger from '../config/logger.config.js';

export const initializeJobs = () => {
  logger.info('Initializing Analytics Aggregation Background Jobs...');

  // Run at minute 5 past every hour (e.g., 01:05, 02:05)
  // This aggregates the previous hour's data.
  cron.schedule('5 * * * *', async () => {
    logger.info('Running Scheduled Job: Hourly Rollup');
    try {
      await aggregationService.processHourlyRollup();
    } catch (err) {
      logger.error('Scheduled Job Failed: Hourly Rollup', err);
    }
  });

  // Run at 00:15 every day
  // This aggregates the previous day's data from the hourly rollups.
  cron.schedule('15 0 * * *', async () => {
    logger.info('Running Scheduled Job: Daily Rollup');
    try {
      await aggregationService.processDailyRollup();
      
      // Right after daily rollup, trigger retention matrix calculation for the past 30 days
      await retentionJob.generateDailyRetentionSnapshots();
      
      // Finally, trigger the AI Insight engine to detect anomalies in the newly aggregated data
      await aiJob.generateDailyInsights();
      
    } catch (err) {
      logger.error('Scheduled Job Failed: Daily Rollup / Retention / AI', err);
    }
  });

  // Run at 01:00 every day
  // Refreshes all dynamic cohort lists
  cron.schedule('0 1 * * *', async () => {
    logger.info('Running Scheduled Job: Cohort Refresh');
    try {
      await cohortJob.refreshDynamicCohorts();
      
      // Also trigger feature adoption calculations
      await featureJob.generateDailyAdoptionSnapshots();
      
      // And refresh dynamic segments
      await segmentJob.refreshDynamicSegments();
    } catch (err) {
      logger.error('Scheduled Job Failed: Cohort/Segment Refresh', err);
    }
  });

  logger.info('Analytics Jobs successfully scheduled.');
};
