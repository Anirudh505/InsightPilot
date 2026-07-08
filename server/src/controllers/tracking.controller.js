import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import eventProcessingService from '../services/eventProcessing.service.js';

class TrackingController {
  
  /**
   * @desc    Collect a single event
   * @route   POST /api/v1/events/collect
   * @access  Public (Requires API Key)
   */
  collect = AsyncHandler(async (req, res) => {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'] || '';
    
    // req.project is populated by the SDK Auth Middleware
    await eventProcessingService.processEvent(req.body, req.project, ipAddress, userAgent);
    
    res.status(200).json(new ApiResponse(200, { success: true }, 'Event collected successfully'));
  });

  /**
   * @desc    Collect a batch of events
   * @route   POST /api/v1/events/batch
   * @access  Public (Requires API Key)
   */
  batch = AsyncHandler(async (req, res) => {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'] || '';
    
    const result = await eventProcessingService.processBatch(req.body.events, req.project, ipAddress, userAgent);
    
    res.status(200).json(new ApiResponse(200, result, 'Batch collected successfully'));
  });
}

export default new TrackingController();
