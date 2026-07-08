import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import funnelService from '../services/funnel.service.js';

class FunnelController {
  
  createFunnel = AsyncHandler(async (req, res) => {
    // req.projectMembership is injected by the authorizeProjectRoles middleware
    const workspaceId = req.projectMembership.project.workspace || req.body.workspaceId; // For tests
    
    const funnel = await funnelService.createFunnel(
      req.params.projectId, 
      workspaceId,
      req.user._id, 
      req.body
    );
    res.status(201).json(new ApiResponse(201, funnel, 'Funnel created successfully'));
  });

  getFunnels = AsyncHandler(async (req, res) => {
    const funnels = await funnelService.getFunnels(req.params.projectId);
    res.status(200).json(new ApiResponse(200, funnels, 'Funnels fetched successfully'));
  });

  getFunnelById = AsyncHandler(async (req, res) => {
    const funnel = await funnelService.getFunnelById(req.params.funnelId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, funnel, 'Funnel fetched'));
  });

  updateFunnel = AsyncHandler(async (req, res) => {
    const funnel = await funnelService.updateFunnel(req.params.funnelId, req.params.projectId, req.body);
    res.status(200).json(new ApiResponse(200, funnel, 'Funnel updated'));
  });

  deleteFunnel = AsyncHandler(async (req, res) => {
    await funnelService.deleteFunnel(req.params.funnelId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, null, 'Funnel archived'));
  });

  calculateFunnel = AsyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body;
    const result = await funnelService.calculateFunnel(req.params.funnelId, req.params.projectId, startDate, endDate);
    // Return 202 Accepted because processing happens async
    res.status(202).json(new ApiResponse(202, result, 'Calculation queued'));
  });
}

export default new FunnelController();
