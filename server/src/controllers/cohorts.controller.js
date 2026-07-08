import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import cohortService from '../services/cohort.service.js';

class CohortController {
  
  createCohort = AsyncHandler(async (req, res) => {
    const workspaceId = req.projectMembership.project.workspace || req.body.workspaceId;
    
    const cohort = await cohortService.createCohort(
      req.params.projectId, 
      workspaceId,
      req.user._id, 
      req.body
    );
    res.status(201).json(new ApiResponse(201, cohort, 'Cohort created successfully'));
  });

  getCohorts = AsyncHandler(async (req, res) => {
    const cohorts = await cohortService.getCohorts(req.params.projectId);
    res.status(200).json(new ApiResponse(200, cohorts, 'Cohorts fetched successfully'));
  });

  getCohortById = AsyncHandler(async (req, res) => {
    const cohort = await cohortService.getCohortById(req.params.cohortId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, cohort, 'Cohort fetched'));
  });

  updateCohort = AsyncHandler(async (req, res) => {
    const cohort = await cohortService.updateCohort(req.params.cohortId, req.params.projectId, req.body);
    res.status(200).json(new ApiResponse(200, cohort, 'Cohort updated'));
  });

  deleteCohort = AsyncHandler(async (req, res) => {
    await cohortService.deleteCohort(req.params.cohortId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, null, 'Cohort archived'));
  });

  calculateCohort = AsyncHandler(async (req, res) => {
    const result = await cohortService.calculateCohort(req.params.cohortId, req.params.projectId);
    res.status(202).json(new ApiResponse(202, result, 'Calculation queued'));
  });
}

export default new CohortController();
