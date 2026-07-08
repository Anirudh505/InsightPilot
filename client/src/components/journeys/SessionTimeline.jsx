import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { MousePointerClick, FileText, AlertTriangle, LogIn, LogOut, ArrowDownLeft, Zap } from 'lucide-react';
import { formatDate } from '@/utils/format';

const getEventIcon = (type) => {
  switch (type) {
    case 'pageview': return <FileText className="h-4 w-4 text-blue-500" />;
    case 'click': return <MousePointerClick className="h-4 w-4 text-emerald-500" />;
    case 'session_start': return <LogIn className="h-4 w-4 text-primary" />;
    case 'session_end': return <LogOut className="h-4 w-4 text-muted-foreground" />;
    case 'bounce': return <ArrowDownLeft className="h-4 w-4 text-amber-500" />;
    case 'feature': return <Zap className="h-4 w-4 text-purple-500" />;
    case 'custom': return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default: return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
};

export function SessionTimeline({ sessions, isLoading, onEventClick, selectedEventId }) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-16 flex flex-col items-center">
              <Skeleton className="h-6 w-12 rounded-full mb-2" />
              <div className="flex-1 w-0.5 bg-border/50"></div>
            </div>
            <div className="flex-1 space-y-3 pb-8">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-10 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No journey data available.</div>;
  }

  return (
    <div className="pl-2">
      {sessions.map((session, sessionIdx) => (
        <div key={session.sessionId} className="relative pb-12 last:pb-0">
          
          {/* Timeline connecting line for session */}
          {sessionIdx !== sessions.length - 1 && (
            <div className="absolute top-8 left-8 bottom-0 w-[2px] bg-border border-dashed border-l-2 -ml-[1px]"></div>
          )}

          {/* Session Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20 z-10 shrink-0 shadow-sm">
              Session {sessions.length - sessionIdx}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {formatDate(session.startTime, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="h-[1px] flex-1 bg-border/50"></div>
          </div>

          {/* Session Events */}
          <div className="space-y-3 ml-[31px]">
            {session.events.map((event, eventIdx) => {
              const isSelected = selectedEventId === event.id;
              
              return (
                <div key={event.id} className="relative flex gap-4 group">
                  
                  {/* Event Timeline Node */}
                  <div className="absolute -left-[35px] top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className={`h-2 w-2 rounded-full z-10 transition-colors ${
                      event.isError ? 'bg-destructive ring-4 ring-destructive/20' : 
                      isSelected ? 'bg-primary ring-4 ring-primary/20' : 'bg-muted-foreground/30 group-hover:bg-primary/50'
                    }`}></div>
                  </div>
                  
                  {/* Event Card */}
                  <button 
                    onClick={() => onEventClick(event)}
                    className={`flex-1 flex items-center justify-between p-3 rounded-md border text-left transition-all ${
                      isSelected 
                        ? 'bg-accent/50 border-primary/50 shadow-sm' 
                        : 'bg-card border-border/50 hover:border-primary/30 hover:shadow-sm'
                    } ${event.isError ? 'bg-destructive/5 border-destructive/20' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded bg-background shadow-sm border border-border ${event.isError ? 'border-destructive/30 bg-destructive/10' : ''}`}>
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <span className={`text-sm font-semibold ${event.isError ? 'text-destructive' : 'text-foreground'}`}>
                          {event.name}
                        </span>
                        {event.properties?.url && (
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-md mt-0.5">
                            {event.properties.url}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                      {formatDate(event.timestamp, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
