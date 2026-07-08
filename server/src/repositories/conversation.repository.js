import { CopilotConversation } from '../models/copilot.model.js';

class ConversationRepository {
  async createConversation(projectId, workspaceId, userId, initialMessage) {
    const title = this._generateTitle(initialMessage.content);
    
    const conversation = new CopilotConversation({
      project: projectId,
      workspace: workspaceId,
      user: userId,
      title,
      messages: [initialMessage]
    });
    
    return await conversation.save();
  }

  async addMessage(conversationId, message) {
    return await CopilotConversation.findByIdAndUpdate(
      conversationId,
      { $push: { messages: message } },
      { new: true }
    );
  }

  async findById(id) {
    return await CopilotConversation.findById(id).where({ deletedAt: null });
  }

  async findByUserAndProject(userId, projectId, limit = 20) {
    return await CopilotConversation.find({ user: userId, project: projectId, deletedAt: null })
      .select('-messages') // exclude messages for the list view to save bandwidth
      .sort({ updatedAt: -1 })
      .limit(limit);
  }

  async softDelete(id) {
    return await CopilotConversation.findByIdAndUpdate(id, { deletedAt: new Date(), isArchived: true });
  }

  _generateTitle(content) {
    // Generate a short title from the first message
    const cleanContent = content.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    if (cleanContent.length <= 30) return cleanContent;
    return cleanContent.substring(0, 30) + '...';
  }
}

export default new ConversationRepository();
