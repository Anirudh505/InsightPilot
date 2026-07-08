import funnelRepository from '../repositories/funnel.repository.js';
import logger from '../config/logger.config.js';

class FunnelJob {
  /**
   * Processes a funnel calculation asynchronously.
   * We use setTimeout here to simulate a message queue consumer decoupling the request from response.
   * In a real clustered environment, this would be pushed to Redis/BullMQ.
   */
  async triggerCalculation(funnelId, startDate, endDate) {
    logger.info(`[Funnel Job] Queueing calculation for funnel ${funnelId}`);
    
    // Mark as calculating
    await funnelRepository.setCalculationStatus(funnelId, 'calculating');

    // Detach from main thread using setTimeout
    setTimeout(async () => {
      try {
        const start = Date.now();
        logger.info(`[Funnel Job] Starting calculation for ${funnelId}`);
        
        const result = await funnelRepository.calculateFunnelConversions(funnelId, new Date(startDate), new Date(endDate));
        
        if (result) {
          await funnelRepository.updateCalculationResult(funnelId, result);
          logger.info(`[Funnel Job] Completed calculation for ${funnelId} in ${Date.now() - start}ms`);
        } else {
          await funnelRepository.setCalculationStatus(funnelId, 'failed');
        }
      } catch (err) {
        logger.error(`[Funnel Job] Failed calculation for funnel ${funnelId}`, err);
        await funnelRepository.setCalculationStatus(funnelId, 'failed');
      }
    }, 100); // 100ms delay to ensure HTTP response is sent immediately
  }
}

export default new FunnelJob();
