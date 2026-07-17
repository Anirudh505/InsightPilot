import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Fetch history data for the Copilot Sidebar
 */
export function useCopilotHistory(projectId) {
  return useQuery({
    queryKey: ['copilot-history', projectId],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/projects/${projectId}/ai/copilot/history`);
        const conversations = data.data || [];
        
        // Map backend conversations to the sidebar format
        const recent = conversations.map(c => ({
          id: c._id,
          // Use the first user message as the title, or fallback
          title: c.messages.find(m => m.role === 'user')?.content.substring(0, 30) + '...' || 'New Chat',
          date: new Date(c.updatedAt).toLocaleDateString()
        }));

        return {
          pinned: [], // Feature for future: pinning chats
          recent: recent.slice(0, 10)
        };
      } catch (err) {
        console.warn('Failed to fetch copilot history, falling back to mock');
        return {
          pinned: [
            { id: 'chat_1', title: 'Q3 Churn Analysis', date: '2 days ago' },
            { id: 'chat_2', title: 'Feature Launch: Export CSV', date: 'Last week' }
          ],
          recent: [
            { id: 'chat_3', title: 'Why did conversion drop in EU?', date: 'Today' },
            { id: 'chat_4', title: 'Compare Free vs Pro retention', date: 'Yesterday' }
          ]
        };
      }
    },
    enabled: !!projectId
  });
}

/**
 * Hook to manage the active chat session state and AI response streaming
 */
export function useCopilotChat(projectId) {
  const queryClient = useQueryClient();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'msg_0',
      role: 'assistant',
      content: 'Hi! I am your InsightPilot AI Analyst. What product metrics would you like to explore today?',
      isStreaming: false,
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [activeEvidence, setActiveEvidence] = useState(null);

  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage) => {
      // 1. Add user message immediately
      const newUserMsg = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newUserMsg]);

      // 2. Add empty assistant message that is "streaming"
      const assistantMsgId = `msg_${Date.now() + 1}`;
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: new Date().toISOString()
      }]);

      let backendReply = "I'm sorry, I couldn't connect to my brain. Please try again later.";
      
      try {
        const { data } = await api.post(`/projects/${projectId}/ai/copilot/chat`, {
          message: userMessage,
          conversationId: conversationId
        });
        
        backendReply = data.data.reply;
        if (data.data.conversationId) {
          setConversationId(data.data.conversationId);
          queryClient.invalidateQueries(['copilot-history', projectId]);
        }
      } catch (err) {
        console.error("AI Chat Error:", err);
      }

      // 3. Simulate streaming word by word for UX
      const words = backendReply.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30)); // fast typing speed
        currentText += (i === 0 ? '' : ' ') + words[i];
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId 
            ? { ...msg, content: currentText } 
            : msg
        ));
      }

      // Finish streaming
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));
      
      // We don't have real evidence generated from the backend yet
      setActiveEvidence(null);
      
      return true;
    }
  });

  const sendMessage = useCallback((text) => {
    if (!text.trim() || sendMessageMutation.isPending || !projectId) return;
    sendMessageMutation.mutate(text);
  }, [sendMessageMutation, projectId]);

  return {
    messages,
    activeEvidence,
    isTyping: sendMessageMutation.isPending,
    sendMessage
  };
}
