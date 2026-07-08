import React from 'react';
import { useParams } from 'react-router-dom';
import { CopilotSidebar } from '@/components/copilot/CopilotSidebar';
import { CopilotChat } from '@/components/copilot/CopilotChat';
import { CopilotEvidencePanel } from '@/components/copilot/CopilotEvidencePanel';
import { useCopilotHistory, useCopilotChat } from '@/hooks/queries/useCopilot';

export default function AICopilotWorkspace() {
  const { projectId } = useParams();
  
  const { data: history, isLoading: isLoadingHistory } = useCopilotHistory(projectId);
  const { messages, activeEvidence, isTyping, sendMessage } = useCopilotChat();

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 lg:-m-8 overflow-hidden bg-background">
      
      {/* Left Column: Sidebar History (Hidden on mobile by default) */}
      <div className="hidden md:block w-64 shrink-0 border-r border-border">
        <CopilotSidebar history={history} isLoading={isLoadingHistory} />
      </div>

      {/* Center Column: Active Chat Interface */}
      <div className="flex-1 min-w-0 border-r border-border relative">
        <CopilotChat 
          messages={messages} 
          onSendMessage={sendMessage} 
          isTyping={isTyping} 
        />
      </div>

      {/* Right Column: Evidence & Reasoning Panel (Hidden on small screens) */}
      <div className="hidden lg:block w-80 shrink-0 bg-muted/10">
        <CopilotEvidencePanel evidence={activeEvidence} />
      </div>

    </div>
  );
}
