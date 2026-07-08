import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import workspaceService from '../services/workspace.service.js';

class WorkspaceController {
  createWorkspace = AsyncHandler(async (req, res) => {
    const workspace = await workspaceService.createWorkspace(req.user._id, req.body);
    res.status(201).json(new ApiResponse(201, workspace, 'Workspace created successfully'));
  });

  getWorkspacesByOrg = AsyncHandler(async (req, res) => {
    // OrgID passed as a query param or param
    const orgId = req.query.orgId || req.params.orgId;
    const workspaces = await workspaceService.getWorkspacesByOrg(orgId);
    res.status(200).json(new ApiResponse(200, workspaces, 'Workspaces fetched successfully'));
  });

  getWorkspaceDetails = AsyncHandler(async (req, res) => {
    const workspace = await workspaceService.getWorkspaceDetails(req.params.workspaceId);
    res.status(200).json(new ApiResponse(200, workspace, 'Workspace details fetched'));
  });

  updateWorkspace = AsyncHandler(async (req, res) => {
    const workspace = await workspaceService.updateWorkspace(req.params.workspaceId, req.body);
    res.status(200).json(new ApiResponse(200, workspace, 'Workspace updated successfully'));
  });
}

export default new WorkspaceController();
