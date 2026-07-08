import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Zap, Activity, Clock, Box } from 'lucide-react';

export function FeatureOverviewCards({ overview, isLoading }) {
  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const Metric = ({ title, value, icon }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-5 flex items-start justify-between">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
            {title}
          </h3>
          <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
        <div className="p-2 bg-primary/10 text-primary rounded-md">
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Metric title="Global Adoption" value={`${overview.globalAdoption}%`} icon={<Activity className="h-5 w-5" />} />
      <Metric title="Total Features" value={overview.totalFeatures} icon={<Box className="h-5 w-5" />} />
      <Metric title="Most Used" value={overview.mostUsed} icon={<Zap className="h-5 w-5" />} />
      <Metric title="Avg Time to Use" value={overview.avgTimeToUse} icon={<Clock className="h-5 w-5" />} />
    </div>
  );
}
