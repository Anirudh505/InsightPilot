import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import projectService from '../services/project.service.js';

class ProjectController {
  createProject = AsyncHandler(async (req, res) => {
    const project = await projectService.createProject(req.user._id, req.body);
    res.status(201).json(new ApiResponse(201, project, 'Project created successfully'));
  });

  getProjectsByWorkspace = AsyncHandler(async (req, res) => {
    const projects = await projectService.getProjectsByWorkspace(req.params.workspaceId);
    res.status(200).json(new ApiResponse(200, projects, 'Projects fetched successfully'));
  });

  getProjectDetails = AsyncHandler(async (req, res) => {
    const project = await projectService.getProjectDetails(req.params.projectId);
    res.status(200).json(new ApiResponse(200, project, 'Project details fetched'));
  });

  updateProject = AsyncHandler(async (req, res) => {
    const project = await projectService.updateProject(req.params.projectId, req.body);
    res.status(200).json(new ApiResponse(200, project, 'Project updated successfully'));
  });

  updateProjectSettings = AsyncHandler(async (req, res) => {
    const project = await projectService.updateProjectSettings(req.params.projectId, req.body);
    res.status(200).json(new ApiResponse(200, project, 'Project settings updated'));
  });

  archiveProject = AsyncHandler(async (req, res) => {
    await projectService.archiveProject(req.params.projectId);
    res.status(200).json(new ApiResponse(200, null, 'Project archived successfully'));
  });

  restoreProject = AsyncHandler(async (req, res) => {
    await projectService.restoreProject(req.params.projectId);
    res.status(200).json(new ApiResponse(200, null, 'Project restored successfully'));
  });
}

export default new ProjectController();
