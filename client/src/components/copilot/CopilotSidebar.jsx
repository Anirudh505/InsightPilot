import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MessageSquare, Plus, Search, Pin, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export function CopilotSidebar({ history, isLoading, onNewAnalysis, onSelectChat }) {
  return (
    <div className="w-full h-full bg-muted/20 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border/50 space-y-4">
        <Button className="w-full justify-start gap-2" size="sm" onClick={onNewAnalysis}>
          <Plus className="h-4 w-4" /> New Analysis
        </Button>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search past chats..." 
            className="pl-8 h-8 bg-background/50 border-border/50 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {history?.pinned?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2 px-2 flex items-center gap-1.5">
                  <Pin className="h-3 w-3" /> Pinned
                </h4>
                <div className="space-y-1">
                  {history.pinned.map(chat => (
                    <button 
                      key={chat.id} 
                      onClick={() => onSelectChat?.(chat.id)}
                      className="w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-accent transition-colors flex flex-col gap-0.5 group"
                    >
                      <span className="font-medium text-foreground truncate">{chat.title}</span>
                      <span className="text-[10px] text-muted-foreground">{chat.date}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Section */}
            {history?.recent?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2 px-2 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Recent
                </h4>
                <div className="space-y-1">
                  {history.recent.map(chat => (
                    <button 
                      key={chat.id} 
                      onClick={() => onSelectChat?.(chat.id)}
                      className="w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-accent transition-colors flex flex-col gap-0.5 group"
                    >
                      <span className="font-medium text-foreground truncate">{chat.title}</span>
                      <span className="text-[10px] text-muted-foreground">{chat.date}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
