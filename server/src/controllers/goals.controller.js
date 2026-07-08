import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import goalRepository from '../repositories/goal.repository.js';

class GoalController {
  
  createGoal = AsyncHandler(async (req, res) => {
    const workspaceId = req.projectMembership.project.workspace || req.body.workspaceId; 
    const goal = await goalRepository.create({
      ...req.body,
      project: req.params.projectId,
      workspace: workspaceId,
      createdBy: req.user._id
    });
    res.status(201).json(new ApiResponse(201, goal, 'Goal created'));
  });

  getGoals = AsyncHandler(async (req, res) => {
    const goals = await goalRepository.findByProject(req.params.projectId);
    res.status(200).json(new ApiResponse(200, goals, 'Goals fetched'));
  });

}

export default new GoalController();
