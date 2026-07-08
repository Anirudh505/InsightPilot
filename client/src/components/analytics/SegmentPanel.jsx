import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function SegmentPanel({ activeSegment, onSegmentChange }) {
  const segments = [
    { id: 'all', label: 'All Users', count: '5.2K', desc: 'Everyone who triggered an event.' },
    { id: 'new', label: 'New Signups', count: '1.1K', desc: 'Users created in this period.' },
    { id: 'active', label: 'Active Users', count: '3.4K', desc: 'Users with > 3 sessions.' },
    { id: 'power', label: 'Power Users', count: '450', desc: 'Top 10% of event volume.' },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            Active Segment
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Filter className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {segments.map(seg => (
            <button
              key={seg.id}
              onClick={() => onSegmentChange(seg.id)}
              className={`flex flex-col items-start p-4 border-b border-border/50 last:border-0 transition-colors text-left ${
                activeSegment === seg.id 
                  ? 'bg-primary/5 border-l-2 border-l-primary' 
                  : 'hover:bg-accent border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-center w-full mb-1">
                <span className={`text-sm font-medium ${activeSegment === seg.id ? 'text-primary' : 'text-foreground'}`}>
                  {seg.label}
                </span>
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {seg.count}
                </span>
              </div>
              <span className="text-xs text-muted-foreground line-clamp-1">{seg.desc}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
