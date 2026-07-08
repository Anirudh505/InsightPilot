import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Clock } from 'lucide-react';
import { formatNumber } from '@/utils/format';

export function FunnelDataTable({ steps, isLoading, activeStepId, onStepClick }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  const formatTime = (seconds) => {
    if (seconds === 0) return '-';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 border-b border-border bg-muted/20">
        <CardTitle className="text-sm font-medium">Conversion Breakdown</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-card border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">Step</th>
              <th className="px-6 py-4 font-semibold text-right">Users</th>
              <th className="px-6 py-4 font-semibold text-right">Conversion</th>
              <th className="px-6 py-4 font-semibold text-right">Drop-off</th>
              <th className="px-6 py-4 font-semibold text-right">Time to Convert</th>
            </tr>
          </thead>
          <tbody>
            {steps?.map((step, idx) => {
              const isActive = activeStepId === step.id;
              
              return (
                <tr 
                  key={step.id} 
                  onClick={() => onStepClick(step.id)}
                  className={`border-b border-border/50 cursor-pointer transition-colors ${
                    isActive ? 'bg-primary/5' : 'hover:bg-accent'
                  }`}
                >
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {idx + 1}
                    </div>
                    {step.name}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {formatNumber(step.converted)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {step.conversionPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right">
                    {idx === 0 ? '-' : (
                      <span className="text-destructive font-medium bg-destructive/10 px-2 py-1 rounded">
                        {step.dropOffPercentage.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground flex items-center justify-end gap-1">
                    {idx !== 0 && <Clock className="h-3 w-3" />}
                    {formatTime(step.medianTimeSeconds)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
