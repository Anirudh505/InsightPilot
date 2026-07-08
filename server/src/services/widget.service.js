import analyticsRepository from '../repositories/analytics.repository.js';
import funnelRepository from '../repositories/funnel.repository.js';
import featureRepository from '../repositories/feature.repository.js';
import insightRepository from '../repositories/insight.repository.js';
import retentionRepository from '../repositories/retention.repository.js';

class WidgetService {
  /**
   * Routes the widget configuration to the appropriate backend service
   * to fetch pre-aggregated data.
   */
  async resolveWidgetData(projectId, widget) {
    const { type, config } = widget;
    
    const now = new Date();
    // Default to last 30 days if not specified
    const startDateStr = config.startDate || new Date(now.setUTCDate(now.getUTCDate() - 30)).toISOString();
    const endDateStr = config.endDate || new Date().toISOString();
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    switch (type) {
      case 'KPICard':
      case 'TrendCard':
        return await this._resolveTrendCard(projectId, config, startDate, endDate);
      
      case 'LineChart':
      case 'AreaChart':
      case 'BarChart':
        return await this._resolveTimeseries(projectId, config, startDate, endDate);
        
      case 'FunnelCard':
        return await this._resolveFunnel(projectId, config);
        
      case 'RetentionMatrix':
        return await this._resolveRetention(projectId, config, startDate, endDate);
        
      case 'FeatureAdoption':
        return await this._resolveFeatureAdoption(projectId, config, startDate, endDate);
        
      case 'AIInsights':
        return await this._resolveAIInsights(projectId, config);
        
      default:
        return null;
    }
  }

  async _resolveTrendCard(projectId, config, startDate, endDate) {
    const summary = await analyticsRepository.getAggregateSummary(projectId, startDate, endDate);
    const metric = config.metric || 'totalEvents'; // dau, pageViews, totalSessions
    return { value: summary[metric] || 0 };
  }

  async _resolveTimeseries(projectId, config, startDate, endDate) {
    const timeseries = await analyticsRepository.getDailyTimeseries(projectId, startDate, endDate);
    const metric = config.metric || 'dau';
    
    return timeseries.map(day => ({
      date: day.day,
      value: day[metric] || 0
    }));
  }

  async _resolveFunnel(projectId, config) {
    if (!config.funnelId) throw new Error('funnelId required');
    const funnel = await funnelRepository.findById(config.funnelId);
    return funnel ? funnel.lastResult : null;
  }

  async _resolveRetention(projectId, config, startDate, endDate) {
    return await retentionRepository.getRetentionHeatmap(
      projectId, startDate, endDate, config.startEvent, config.returnEvent
    );
  }

  async _resolveFeatureAdoption(projectId, config, startDate, endDate) {
    if (!config.featureId) throw new Error('featureId required');
    return await featureRepository.getAdoptionSnapshots(config.featureId, startDate, endDate);
  }

  async _resolveAIInsights(projectId, config) {
    const limit = config.limit || 5;
    return await insightRepository.findByProject(projectId, limit);
  }
}

export default new WidgetService();
