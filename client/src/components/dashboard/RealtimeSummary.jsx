import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Activity, Users } from 'lucide-react';
import { formatNumber } from '@/utils/format';

export function RealtimeSummary({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
  }

  const activeUsers = data?.activeUsersRightNow || 0;
  const eventsPerMinute = data?.eventsPerMinute || 0;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 relative overflow-hidden">
      {/* Decorative pulse ring */}
      <div className="absolute top-6 right-6 h-3 w-3 rounded-full bg-primary animate-ping opacity-75"></div>
      <div className="absolute top-6 right-6 h-3 w-3 rounded-full bg-primary"></div>

      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center">
          <Activity className="h-4 w-4 mr-2 text-primary" />
          Realtime Activity (15m)
        </h3>
        
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">{formatNumber(activeUsers)}</span>
          <span className="text-sm text-muted-foreground font-medium">Active Users</span>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{eventsPerMinute} events/min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
