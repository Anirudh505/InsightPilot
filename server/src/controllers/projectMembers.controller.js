import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import projectMemberService from '../services/projectMember.service.js';

class ProjectMemberController {
  addMember = AsyncHandler(async (req, res) => {
    const { email, role } = req.body;
    const member = await projectMemberService.addMember(req.params.projectId, email, role, req.user._id);
    res.status(201).json(new ApiResponse(201, member, 'Member added to project successfully'));
  });

  getMembers = AsyncHandler(async (req, res) => {
    const members = await projectMemberService.getMembers(req.params.projectId);
    res.status(200).json(new ApiResponse(200, members, 'Project members fetched'));
  });

  updateRole = AsyncHandler(async (req, res) => {
    const member = await projectMemberService.updateRole(req.params.memberId, req.body.role, req.user._id);
    res.status(200).json(new ApiResponse(200, member, 'Member role updated'));
  });

  removeMember = AsyncHandler(async (req, res) => {
    await projectMemberService.removeMember(req.params.memberId);
    res.status(200).json(new ApiResponse(200, null, 'Member removed from project'));
  });
}

export default new ProjectMemberController();
