import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import journeyService from '../services/journey.service.js';

class JourneyController {
  
  getJourneys = AsyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const journeys = await journeyService.getJourneys(req.params.projectId, limit, skip);
    res.status(200).json(new ApiResponse(200, journeys, 'Journeys fetched successfully'));
  });

  getJourneyPath = AsyncHandler(async (req, res) => {
    const path = await journeyService.getJourneyPath(req.params.projectId, req.params.userId);
    res.status(200).json(new ApiResponse(200, path, 'Journey path reconstructed'));
  });

}

export default new JourneyController();
