import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/format';

export function RetentionHeatmap({ matrix, isLoading }) {
  if (isLoading || !matrix) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find max days to render columns
  const maxDays = Math.max(...matrix.map(row => row.days.length));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 border-b border-border bg-muted/10">
        <CardTitle className="text-sm font-medium">Retention Cohort Matrix</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-card text-muted-foreground border-b border-border">
              <th className="p-3 font-semibold min-w-[120px]">Cohort</th>
              <th className="p-3 font-semibold text-right min-w-[80px]">Users</th>
              {Array.from({ length: maxDays }).map((_, i) => (
                <th key={i} className="p-3 font-semibold text-center min-w-[60px]">Day {i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, idx) => (
              <tr key={idx} className="border-b border-border/50 group">
                <td className="p-3 font-medium whitespace-nowrap bg-card">
                  {formatDate(row.cohortDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-3 text-right font-mono text-muted-foreground bg-card">
                  {row.cohortSize.toLocaleString()}
                </td>
                {Array.from({ length: maxDays }).map((_, i) => {
                  const dayData = row.days.find(d => d.dayIndex === i);
                  
                  if (!dayData) {
                    return <td key={i} className="p-0 m-0"><div className="h-full w-full bg-muted/20"></div></td>;
                  }

                  // Calculate opacity based on percentage for heatmap effect
                  // Day 0 is always 100%, we don't want it to be full solid primary, maybe a bit distinct
                  const opacity = Math.max(0.1, dayData.percentage / 100);
                  
                  return (
                    <td key={i} className="p-0 relative">
                      <div 
                        className="absolute inset-0.5 rounded-sm transition-opacity group-hover:opacity-80"
                        style={{ backgroundColor: `hsl(var(--primary) / ${i === 0 ? 0.2 : opacity})` }}
                      ></div>
                      <div className={`relative h-10 flex items-center justify-center font-medium ${
                        opacity > 0.6 && i !== 0 ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {dayData.percentage.toFixed(0)}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
