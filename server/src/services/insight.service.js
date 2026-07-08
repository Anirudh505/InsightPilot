import { DailyAnalytics } from '../models/dailyAnalytics.model.js';
import insightRepository from '../repositories/insight.repository.js';

class InsightService {
  /**
   * Deterministically scans aggregate data for mathematical anomalies.
   * This ensures the AI isn't hallucinating base metrics.
   */
  async detectAnomalies(projectId, workspaceId) {
    const insights = [];
    const now = new Date();
    const today = new Date(now);
    today.setUTCHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

    // 1. Fetch the last 30 days of analytics
    const dailyData = await DailyAnalytics.find({
      project: projectId,
      day: { $gte: thirtyDaysAgo, $lte: today }
    }).sort({ day: 1 });

    if (dailyData.length < 14) return insights; // Need enough data for baseline

    // Simple Moving Average calculation
    const recentWeek = dailyData.slice(-7);
    const previousWeek = dailyData.slice(-14, -7);

    const getAvg = (arr, key) => arr.reduce((sum, item) => sum + (item[key] || 0), 0) / arr.length;

    const recentAvgDAU = getAvg(recentWeek, 'dau');
    const prevAvgDAU = getAvg(previousWeek, 'dau');

    // Rule 1: Detect > 20% drop in DAU (Retention Risk)
    if (prevAvgDAU > 0 && recentAvgDAU < (prevAvgDAU * 0.8)) {
      const drop = Number((((prevAvgDAU - recentAvgDAU) / prevAvgDAU) * 100).toFixed(2));
      const insight = await insightRepository.create({
        project: projectId,
        workspace: workspaceId,
        type: 'Retention Risk',
        title: 'Significant Drop in Daily Active Users',
        description: `Average DAU dropped by ${drop}% over the last 7 days compared to the previous week.`,
        sourceMetadata: {
          sourceType: 'analytics',
          metricName: 'DAU',
          previousValue: prevAvgDAU,
          currentValue: recentAvgDAU,
          percentageChange: -drop
        }
      });
      insights.push(insight);
    }

    // Rule 2: Detect > 30% increase in Bounce Rate (Performance/UX Regression)
    const recentAvgBounce = getAvg(recentWeek, 'bounceRate');
    const prevAvgBounce = getAvg(previousWeek, 'bounceRate');

    if (prevAvgBounce > 0 && recentAvgBounce > (prevAvgBounce * 1.3)) {
      const increase = Number((((recentAvgBounce - prevAvgBounce) / prevAvgBounce) * 100).toFixed(2));
      const insight = await insightRepository.create({
        project: projectId,
        workspace: workspaceId,
        type: 'Performance Regression',
        title: 'Spike in Bounce Rate',
        description: `Bounce rate increased by ${increase}% this week. Users are abandoning sessions early.`,
        sourceMetadata: {
          sourceType: 'analytics',
          metricName: 'Bounce Rate',
          previousValue: prevAvgBounce,
          currentValue: recentAvgBounce,
          percentageChange: increase
        }
      });
      insights.push(insight);
    }

    return insights;
  }

  async getInsights(projectId, limit = 20) {
    return await insightRepository.findByProject(projectId, limit);
  }
}

export default new InsightService();
