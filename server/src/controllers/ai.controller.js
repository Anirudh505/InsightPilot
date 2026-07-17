import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import insightService from '../services/insight.service.js';
import copilotService from '../services/copilot.service.js';

class AIController {
  
  getInsights = AsyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const insights = await insightService.getInsights(req.params.projectId, limit);
    res.status(200).json(new ApiResponse(200, insights, 'Insights fetched successfully'));
  });

  chat = AsyncHandler(async (req, res) => {
    const workspaceId = req.projectMembership.project.workspace || req.body.workspaceId;
    const { message, conversationId } = req.body;

    const response = await copilotService.handleChat(
      req.params.projectId,
      workspaceId,
      req.user._id,
      message,
      conversationId
    );

    res.status(200).json(new ApiResponse(200, response, 'Chat response generated'));
  });

  getChatHistory = AsyncHandler(async (req, res) => {
    const history = await copilotService.getHistory(req.params.projectId, req.user._id);
    res.status(200).json(new ApiResponse(200, history, 'Chat history fetched'));
  });

  getConversation = AsyncHandler(async (req, res) => {
    const conversation = await copilotService.getConversation(req.params.conversationId);
    if (!conversation) {
      res.status(404).json(new ApiResponse(404, null, 'Conversation not found'));
      return;
    }
    res.status(200).json(new ApiResponse(200, conversation, 'Conversation fetched'));
  });
}

export default new AIController();
