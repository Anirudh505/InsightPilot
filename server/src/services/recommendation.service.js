import aiProvider from './aiProvider.service.js';
import insightRepository from '../repositories/insight.repository.js';
import logger from '../config/logger.config.js';

class RecommendationService {
  /**
   * Takes a deterministically generated insight and uses the LLM to 
   * generate human-readable strategic recommendations.
   */
  async generateRecommendationsForInsight(insight) {
    try {
      const prompt = `
        You are an expert Product Manager and Growth Analyst.
        Review the following product analytics insight and provide 2-3 actionable recommendations to improve the metric.
        
        Insight Type: ${insight.type}
        Title: ${insight.title}
        Description: ${insight.description}
        Metric Context: ${JSON.stringify(insight.sourceMetadata)}

        Respond STRICTLY in the following JSON format:
        {
          "recommendations": [
            {
              "title": "Short action title",
              "description": "Detailed explanation of why this action will help.",
              "priority": "low" | "medium" | "high" | "critical",
              "businessImpact": "Explanation of potential KPI improvement",
              "confidenceScore": 85,
              "actionItems": ["Step 1", "Step 2"]
            }
          ]
        }
      `;

      const response = await aiProvider.generateCompletion([
        { role: 'system', content: 'You are an analytics copilot responding only in strict JSON.' },
        { role: 'user', content: prompt }
      ], { jsonMode: true });

      const parsed = JSON.parse(response.content);
      
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        for (const rec of parsed.recommendations) {
          await insightRepository.addRecommendation(insight._id, rec);
        }
      }

    } catch (err) {
      logger.error(`[RecommendationService] Failed to generate AI recommendations for insight ${insight._id}`, err);
    }
  }
}

export default new RecommendationService();
