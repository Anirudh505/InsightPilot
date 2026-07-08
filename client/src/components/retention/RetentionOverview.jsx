import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';

export function RetentionOverview({ overview, isLoading }) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const Metric = ({ title, value, icon, suffix = '%', trend = null }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-5">
        <h3 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-1.5">
          {icon} {title}
        </h3>
        <div className="flex items-end gap-2 mt-2">
          <div className="text-2xl font-bold">{value}{suffix}</div>
          {trend && (
            <div className={`text-xs font-medium mb-1 ${trend > 0 ? 'text-emerald-500' : 'text-destructive'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Metric title="Day 1 Retention" value={overview.day1} icon={<Clock className="h-3 w-3" />} trend={2.4} />
      <Metric title="Day 7 Retention" value={overview.day7} icon={<Clock className="h-3 w-3" />} trend={-1.2} />
      <Metric title="Day 30 Retention" value={overview.day30} icon={<Clock className="h-3 w-3" />} trend={0.8} />
      <Metric title="Avg Churn Rate" value={overview.churnRate} icon={<Users className="h-3 w-3" />} trend={-3.5} />
    </div>
  );
}
