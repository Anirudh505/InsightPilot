import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Send, Sparkles, User, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatMessage({ msg }) {
  const isAI = msg.role === 'assistant';
  
  return (
    <div className={`flex gap-4 p-4 rounded-xl ${isAI ? 'bg-card border border-border/50 shadow-sm' : ''}`}>
      <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isAI ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {isAI ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            {isAI ? 'InsightPilot Copilot' : 'You'}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="text-sm prose prose-sm dark:prose-invert max-w-none leading-relaxed">
          {isAI && msg.content === '' && msg.isStreaming ? (
            <div className="flex gap-1 items-center h-5">
              <span className="animate-bounce inline-block h-1.5 w-1.5 bg-primary rounded-full" style={{ animationDelay: '0ms' }} />
              <span className="animate-bounce inline-block h-1.5 w-1.5 bg-primary rounded-full" style={{ animationDelay: '150ms' }} />
              <span className="animate-bounce inline-block h-1.5 w-1.5 bg-primary rounded-full" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

export function CopilotChat({ messages, onSendMessage, isTyping, onResetContext }) {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  const suggestions = [
    "Why did churn increase last week?",
    "Show me the conversion drop in EU",
    "Which feature correlates best with retention?"
  ];

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="h-14 shrink-0 border-b border-border flex items-center px-6 justify-between bg-card/50 backdrop-blur-sm z-10 absolute top-0 w-full">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Product Analyst Copilot
        </h2>
        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={onResetContext}>
          <RefreshCcw className="h-3 w-3 mr-2" /> Reset Context
        </Button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 pt-20 pb-32 space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          
          {/* Follow-up suggestions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((text, i) => (
                <button 
                  key={i}
                  onClick={() => { setInput(text); onSendMessage(text); }}
                  className="text-xs bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full transition-colors border border-border/50"
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me to analyze funnels, explain churn, or suggest experiments..."
              className="w-full bg-card border border-border rounded-xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none custom-scrollbar"
              rows={2}
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 bottom-3 h-8 w-8 rounded-lg"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </form>
          <div className="text-center">
            <span className="text-[10px] text-muted-foreground">
              AI Copilot can make mistakes. Always verify critical metrics on the dashboard.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
