import aiProvider from './aiProvider.service.js';
import conversationRepository from '../repositories/conversation.repository.js';
import analyticsRepository from '../repositories/analytics.repository.js';

class CopilotService {
  async handleChat(projectId, workspaceId, userId, message, conversationId = null) {
    let conversation;

    // 1. Get or create conversation history
    if (conversationId) {
      conversation = await conversationRepository.findById(conversationId);
      conversation = await conversationRepository.addMessage(conversation._id, { role: 'user', content: message });
    } else {
      conversation = await conversationRepository.createConversation(
        projectId, workspaceId, userId, { role: 'user', content: message }
      );
    }

    // 2. Build RAG Context (Retrieve aggregated analytics)
    // In a full production system, we'd use function calling to let the LLM request specific data.
    // Here we inject a quick 7-day summary so it can answer basic questions.
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    
    const summary = await analyticsRepository.getAggregateSummary(projectId, sevenDaysAgo, now);

    const systemPrompt = `
      You are InsightPilot Copilot, an expert AI data analyst.
      You are analyzing product analytics for a SaaS application.
      
      CURRENT METRICS (Last 7 Days):
      - Total Events: ${summary.totalEvents}
      - Total Sessions: ${summary.totalSessions}
      - Page Views: ${summary.pageViews}
      - Average Bounce Rate: ${Number((summary.avgBounceRate || 0).toFixed(2))}%
      
      Always be concise. Base your answers strictly on the provided metrics when relevant.
      If you don't have the data, admit it. Do not hallucinate metrics.
    `;

    // 3. Format messages for AI Provider
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add recent history (last 10 messages)
    const history = conversation.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    messages.push(...history);

    // 4. Generate Response
    const response = await aiProvider.generateCompletion(messages);

    // 5. Save AI Response
    const aiMessage = {
      role: 'assistant',
      content: response.content,
      tokensUsed: response.usage.total_tokens
    };

    await conversationRepository.addMessage(conversation._id, aiMessage);

    return {
      conversationId: conversation._id,
      reply: aiMessage.content
    };
  }

  async getHistory(projectId, userId) {
    return await conversationRepository.findByUserAndProject(userId, projectId);
  }

  async getConversation(conversationId) {
    return await conversationRepository.findById(conversationId);
  }
}

export default new CopilotService();
