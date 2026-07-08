import retentionRepository from '../repositories/retention.repository.js';
import { BadRequestError } from '../utils/ApiError.js';

class RetentionService {
  /**
   * Fetches the standard Retention Heatmap data for a specific date range.
   */
  async getRetentionHeatmap(projectId, startDateStr, endDateStr, startEvent, returnEvent) {
    if (!startDateStr || !endDateStr) {
      throw new BadRequestError('start_date and end_date are required');
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const snapshots = await retentionRepository.getRetentionHeatmap(projectId, startDate, endDate, startEvent, returnEvent);
    
    // Formatting the response into an easily chartable matrix
    const matrix = snapshots.map(snap => ({
      cohortDate: snap.cohortDate,
      cohortSize: snap.cohortSize,
      retention: snap.retentionMatrix
    }));

    return {
      startDate,
      endDate,
      startEvent: startEvent || 'Any Event',
      returnEvent: returnEvent || 'Any Event',
      matrix
    };
  }
}

export default new RetentionService();
