import React from 'react';
import { useParams } from 'react-router-dom';
import { CopilotSidebar } from '@/components/copilot/CopilotSidebar';
import { CopilotChat } from '@/components/copilot/CopilotChat';
import { CopilotEvidencePanel } from '@/components/copilot/CopilotEvidencePanel';
import { useCopilotHistory, useCopilotChat } from '@/hooks/queries/useCopilot';

export default function AICopilotWorkspace() {
  const { projectId } = useParams();
  
  const { data: history, isLoading: isLoadingHistory } = useCopilotHistory(projectId);
  const { messages, activeEvidence, isTyping, isLoadingChat, sendMessage, resetChat, loadChat } = useCopilotChat(projectId);

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 lg:-m-8 overflow-hidden bg-background">
      
      {/* Left Column: Sidebar History (Hidden on mobile by default) */}
      <div className="hidden md:block w-64 shrink-0 border-r border-border relative">
        {isLoadingChat && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>
          </div>
        )}
        <CopilotSidebar 
          history={history} 
          isLoading={isLoadingHistory} 
          onNewAnalysis={resetChat} 
          onSelectChat={loadChat}
        />
      </div>

      {/* Center Column: Active Chat Interface */}
      <div className="flex-1 min-w-0 border-r border-border relative">
        <CopilotChat 
          messages={messages} 
          onSendMessage={sendMessage} 
          isTyping={isTyping}
          onResetContext={resetChat}
        />
      </div>

      {/* Right Column: Evidence & Reasoning Panel (Hidden on small screens) */}
      <div className="hidden lg:block w-80 shrink-0 bg-muted/10">
        <CopilotEvidencePanel evidence={activeEvidence} onActionClick={sendMessage} isTyping={isTyping} />
      </div>

    </div>
  );
}
