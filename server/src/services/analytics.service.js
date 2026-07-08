import analyticsRepository from '../repositories/analytics.repository.js';
import cacheService from '../utils/cache.util.js';
import { BadRequestError } from '../utils/ApiError.js';

class AnalyticsService {
  
  _parseDateRange(range) {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);
    
    switch (range) {
      case 'today':
        start.setUTCHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        start.setUTCDate(start.getUTCDate() - 1);
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCDate(end.getUTCDate() - 1);
        end.setUTCHours(23, 59, 59, 999);
        break;
      case '7d':
        start.setUTCDate(start.getUTCDate() - 7);
        break;
      case '30d':
        start.setUTCDate(start.getUTCDate() - 30);
        break;
      case '90d':
        start.setUTCDate(start.getUTCDate() - 90);
        break;
      default:
        // default 30d
        start.setUTCDate(start.getUTCDate() - 30);
    }
    return { start, end };
  }

  _calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
  }

  async getOverview(projectId, range = '30d') {
    const cacheKey = `analytics:overview:${projectId}:${range}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const { start, end } = this._parseDateRange(range);
    
    // Calculate previous period for growth comparison
    const durationMs = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - durationMs);
    const prevEnd = new Date(start.getTime() - 1);

    const [currentSummary, prevSummary, dailyTrends] = await Promise.all([
      analyticsRepository.getAggregateSummary(projectId, start, end),
      analyticsRepository.getAggregateSummary(projectId, prevStart, prevEnd),
      analyticsRepository.getDailyTrends(projectId, start, end)
    ]);

    const result = {
      dateRange: { start, end },
      metrics: {
        totalEvents: {
          value: currentSummary.totalEvents,
          growth: this._calculateGrowth(currentSummary.totalEvents, prevSummary.totalEvents)
        },
        totalSessions: {
          value: currentSummary.totalSessions,
          growth: this._calculateGrowth(currentSummary.totalSessions, prevSummary.totalSessions)
        },
        pageViews: {
          value: currentSummary.pageViews,
          growth: this._calculateGrowth(currentSummary.pageViews, prevSummary.pageViews)
        },
        bounceRate: {
          value: Number((currentSummary.avgBounceRate || 0).toFixed(2)),
          growth: this._calculateGrowth(currentSummary.avgBounceRate, prevSummary.avgBounceRate) // Note: decrease is usually better for bounce rate
        },
        avgSessionDuration: {
          value: Math.round(currentSummary.avgSessionDuration || 0),
          growth: this._calculateGrowth(currentSummary.avgSessionDuration, prevSummary.avgSessionDuration)
        }
      },
      trends: dailyTrends.map(day => ({
        date: day.day,
        events: day.totalEvents,
        sessions: day.totalSessions,
        dau: day.dau
      }))
    };

    // Cache for 15 minutes
    await cacheService.set(cacheKey, result, 900);
    return result;
  }

  async getEventsDistribution(projectId, range = '30d') {
    const cacheKey = `analytics:events:${projectId}:${range}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const { start, end } = this._parseDateRange(range);
    const dailyData = await analyticsRepository.getDailyTrends(projectId, start, end);

    const eventCounts = {};
    dailyData.forEach(day => {
      if (day.events) {
        day.events.forEach((count, eventName) => {
          eventCounts[eventName] = (eventCounts[eventName] || 0) + count;
        });
      }
    });

    const sortedEvents = Object.entries(eventCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
      .slice(0, 50); // Top 50

    await cacheService.set(cacheKey, sortedEvents, 900);
    return sortedEvents;
  }
}

export default new AnalyticsService();
