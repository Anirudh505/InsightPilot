import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import retentionService from '../services/retention.service.js';
import lifecycleService from '../services/lifecycle.service.js';

class RetentionController {
  
  getRetentionHeatmap = AsyncHandler(async (req, res) => {
    const { start_date, end_date, start_event, return_event } = req.query;
    
    const heatmap = await retentionService.getRetentionHeatmap(
      req.params.projectId, 
      start_date, 
      end_date, 
      start_event, 
      return_event
    );
    
    res.status(200).json(new ApiResponse(200, heatmap, 'Retention heatmap fetched'));
  });

  getLifecycleOverview = AsyncHandler(async (req, res) => {
    const overview = await lifecycleService.getLifecycleOverview(req.params.projectId);
    res.status(200).json(new ApiResponse(200, overview, 'Lifecycle overview fetched'));
  });

}

export default new RetentionController();
