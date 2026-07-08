import insightService from '../services/insight.service.js';
import recommendationService from '../services/recommendation.service.js';
import logger from '../config/logger.config.js';

class AIJob {
  /**
   * Runs nightly after all other aggregation jobs are complete.
   * Scans aggregated data for mathematical anomalies, generates Insights, 
   * and requests LLM recommendations.
   */
  async generateDailyInsights() {
    logger.info(`[AI Job] Starting Daily Insight Generation...`);
    try {
      const { Project } = await import('../models/project.model.js');
      const projects = await Project.find({ status: 'active' }).select('_id workspace');

      let processed = 0;
      let anomaliesDetected = 0;

      for (const project of projects) {
        // 1. Deterministic Anomaly Detection
        const insights = await insightService.detectAnomalies(project._id, project.workspace);
        
        // 2. AI Recommendation Generation for detected anomalies
        for (const insight of insights) {
          anomaliesDetected++;
          // Pass the deterministic insight to the LLM to get business recommendations
          await recommendationService.generateRecommendationsForInsight(insight);
        }
        
        processed++;
      }
      
      logger.info(`[AI Job] Completed AI insights for ${processed} projects. Detected ${anomaliesDetected} anomalies.`);
    } catch (err) {
      logger.error(`[AI Job] Daily insight generation failed`, err);
    }
  }
}

export default new AIJob();
