import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import segmentationService from '../services/segmentation.service.js';

class SegmentController {
  
  createSegment = AsyncHandler(async (req, res) => {
    const workspaceId = req.projectMembership.project.workspace || req.body.workspaceId;
    const segment = await segmentationService.createSegment(req.params.projectId, workspaceId, req.user._id, req.body);
    res.status(201).json(new ApiResponse(201, segment, 'Segment created successfully'));
  });

  getSegments = AsyncHandler(async (req, res) => {
    const segments = await segmentationService.getSegments(req.params.projectId);
    res.status(200).json(new ApiResponse(200, segments, 'Segments fetched successfully'));
  });

  getSegmentById = AsyncHandler(async (req, res) => {
    const segment = await segmentationService.getSegmentById(req.params.segmentId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, segment, 'Segment fetched'));
  });

  updateSegment = AsyncHandler(async (req, res) => {
    const segment = await segmentationService.updateSegment(req.params.segmentId, req.params.projectId, req.body);
    res.status(200).json(new ApiResponse(200, segment, 'Segment updated'));
  });

  deleteSegment = AsyncHandler(async (req, res) => {
    await segmentationService.deleteSegment(req.params.segmentId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, null, 'Segment archived'));
  });

  calculateSegment = AsyncHandler(async (req, res) => {
    const result = await segmentationService.calculateSegment(req.params.segmentId, req.params.projectId);
    res.status(202).json(new ApiResponse(202, result, 'Calculation queued'));
  });
}

export default new SegmentController();
