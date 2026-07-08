import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { UserCircle, Clock, MousePointerClick, CalendarDays } from 'lucide-react';
import { formatDate } from '@/utils/format';

export function UserSummaryProfile({ user, isLoading }) {
  if (isLoading || !user) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 flex items-center gap-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row border-b border-border/50 bg-muted/20">
          {/* Identity Section */}
          <div className="p-6 flex items-center gap-4 flex-1 md:border-r border-border/50">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserCircle className="h-10 w-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                {user.isConverted && <Badge variant="success">Converted</Badge>}
              </div>
              <p className="text-muted-foreground text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {user.id}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-6 flex flex-wrap gap-8 flex-1 items-center bg-card">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Clock className="h-3 w-3" /> Total Sessions
              </span>
              <span className="text-xl font-semibold">{user.totalSessions}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1">
                <MousePointerClick className="h-3 w-3" /> Total Events
              </span>
              <span className="text-xl font-semibold">{user.totalEvents}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1">
                <CalendarDays className="h-3 w-3" /> First Seen
              </span>
              <span className="text-sm font-medium">{formatDate(user.firstSeen)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
