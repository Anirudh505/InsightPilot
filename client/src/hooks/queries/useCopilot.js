import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Mock history data for the Copilot Sidebar
 */
export function useCopilotHistory(projectId) {
  return useQuery({
    queryKey: ['copilot-history', projectId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
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
    },
    enabled: !!projectId
  });
}

/**
 * Hook to manage the active chat session state and mock the AI response streaming
 */
export function useCopilotChat() {
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

      // 3. Mock the streaming response delay
      const mockResponse = `Based on my analysis of the **Paid Social** segment over the last 30 days:
      
1. **Conversion Drop**: The funnel completion rate for the EU region dropped by **14.2%** starting last Tuesday.
2. **Bottleneck**: The primary drop-off occurred at the *Team Invite* step.
3. **Correlation**: Users who failed to invite a team member within 24 hours had a 65% higher likelihood of churning by Day 7.

I recommend implementing an in-app tooltip that highlights the value of inviting a team member immediately after they complete their profile.`;

      const mockEvidence = {
        metrics: [
          { label: 'Conversion Drop', value: '-14.2%', trend: 'down' },
          { label: 'Team Invite Drop-off', value: '68%', trend: 'up' }
        ],
        funnelRef: 'f_onboarding',
        cohortRef: 'c_paid_social',
        reasoning: 'Detected significant statistical variance in EU segment compared to global baseline beginning Oct 12th.',
        confidence: 94
      };

      // Simulate streaming word by word
      const words = mockResponse.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50)); // typing speed
        currentText += (i === 0 ? '' : ' ') + words[i];
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId 
            ? { ...msg, content: currentText } 
            : msg
        ));
      }

      // Finish streaming and set evidence
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));
      
      setActiveEvidence(mockEvidence);
      
      return true;
    }
  });

  const sendMessage = useCallback((text) => {
    if (!text.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(text);
  }, [sendMessageMutation]);

  return {
    messages,
    activeEvidence,
    isTyping: sendMessageMutation.isPending,
    sendMessage
  };
}
