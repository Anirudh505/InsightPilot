import featureRepository from '../repositories/feature.repository.js';
import { BadRequestError } from '../utils/ApiError.js';

class FeatureAnalyticsService {
  /**
   * Retrieves the pre-calculated feature adoption metrics over a date range.
   */
  async getAdoptionTrend(projectId, featureId, startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) {
      throw new BadRequestError('start_date and end_date are required');
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const snapshots = await featureRepository.getAdoptionSnapshots(featureId, startDate, endDate);
    
    let totalInvocations = 0;
    let maxAdoption = 0;

    const trend = snapshots.map(snap => {
      totalInvocations += snap.totalInvocations;
      if (snap.adoptionRate > maxAdoption) maxAdoption = snap.adoptionRate;

      return {
        date: snap.day,
        activeUsers: snap.activeUsers,
        projectActiveUsers: snap.projectActiveUsers,
        adoptionRate: snap.adoptionRate,
        averageInvocationsPerUser: snap.averageInvocationsPerUser
      };
    });

    return {
      featureId,
      dateRange: { start: startDate, end: endDate },
      summary: {
        totalInvocations,
        peakAdoptionRate: maxAdoption
      },
      trend
    };
  }
}

export default new FeatureAnalyticsService();
