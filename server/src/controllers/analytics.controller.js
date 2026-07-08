import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import analyticsService from '../services/analytics.service.js';

class AnalyticsController {
  
  getOverview = AsyncHandler(async (req, res) => {
    const { projectId, range } = req.query;
    const overview = await analyticsService.getOverview(projectId, range);
    res.status(200).json(new ApiResponse(200, overview, 'Analytics overview fetched successfully'));
  });

  getEventsDistribution = AsyncHandler(async (req, res) => {
    const { projectId, range } = req.query;
    const events = await analyticsService.getEventsDistribution(projectId, range);
    res.status(200).json(new ApiResponse(200, events, 'Events distribution fetched'));
  });

}

export default new AnalyticsController();
