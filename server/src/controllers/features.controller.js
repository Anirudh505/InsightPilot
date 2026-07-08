import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import featureService from '../services/feature.service.js';
import featureAnalyticsService from '../services/featureAnalytics.service.js';

class FeatureController {
  createFeature = AsyncHandler(async (req, res) => {
    const workspaceId = req.projectMembership.project.workspace || req.body.workspaceId;
    const feature = await featureService.createFeature(req.params.projectId, workspaceId, req.user._id, req.body);
    res.status(201).json(new ApiResponse(201, feature, 'Feature defined successfully'));
  });

  getFeatures = AsyncHandler(async (req, res) => {
    const features = await featureService.getFeatures(req.params.projectId);
    res.status(200).json(new ApiResponse(200, features, 'Features fetched successfully'));
  });

  getFeatureById = AsyncHandler(async (req, res) => {
    const feature = await featureService.getFeatureById(req.params.featureId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, feature, 'Feature fetched'));
  });

  updateFeature = AsyncHandler(async (req, res) => {
    const feature = await featureService.updateFeature(req.params.featureId, req.params.projectId, req.body);
    res.status(200).json(new ApiResponse(200, feature, 'Feature updated'));
  });

  deleteFeature = AsyncHandler(async (req, res) => {
    await featureService.deleteFeature(req.params.featureId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, null, 'Feature archived'));
  });

  getAdoption = AsyncHandler(async (req, res) => {
    const { start_date, end_date } = req.query;
    const adoption = await featureAnalyticsService.getAdoptionTrend(req.params.projectId, req.params.featureId, start_date, end_date);
    res.status(200).json(new ApiResponse(200, adoption, 'Adoption metrics fetched'));
  });
}

export default new FeatureController();
