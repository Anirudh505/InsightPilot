import segmentRepository from '../repositories/segment.repository.js';
import logger from '../config/logger.config.js';

class SegmentJob {
  async triggerCalculation(segmentId) {
    logger.info(`[Segment Job] Queueing calculation for segment ${segmentId}`);
    
    await segmentRepository.setCalculationStatus(segmentId, 'calculating');

    setTimeout(async () => {
      try {
        const start = Date.now();
        const result = await segmentRepository.calculateSegmentUsers(segmentId);
        
        if (result) {
          await segmentRepository.updateCalculationResult(segmentId, result);
          logger.info(`[Segment Job] Completed calculation for ${segmentId} in ${Date.now() - start}ms`);
        } else {
          await segmentRepository.setCalculationStatus(segmentId, 'failed');
        }
      } catch (err) {
        logger.error(`[Segment Job] Failed calculation for segment ${segmentId}`, err);
        await segmentRepository.setCalculationStatus(segmentId, 'failed');
      }
    }, 100); 
  }

  async refreshDynamicSegments() {
    logger.info(`[Segment Job] Starting nightly refresh of dynamic segments`);
    try {
      const { Segment } = await import('../models/segment.model.js');
      const segments = await Segment.find({ isDynamic: true, isArchived: false, deletedAt: null });
      
      for (const segment of segments) {
        await this.triggerCalculation(segment._id);
      }
      logger.info(`[Segment Job] Queued ${segments.length} segments for refresh.`);
    } catch (err) {
      logger.error(`[Segment Job] Nightly refresh failed`, err);
    }
  }
}

export default new SegmentJob();
