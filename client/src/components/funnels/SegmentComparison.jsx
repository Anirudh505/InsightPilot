import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export function SegmentComparison({ dimension, data, isLoading, onChangeDimension }) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-24 rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  const dimensions = [
    { id: 'device', label: 'Device' },
    { id: 'browser', label: 'Browser' },
    { id: 'country', label: 'Country' }
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-0 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Compare by Segment</CardTitle>
          <div className="flex gap-1">
            {dimensions.map(d => (
              <button
                key={d.id}
                onClick={() => onChangeDimension(d.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  dimension === d.id 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-6">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis 
                type="category" 
                dataKey="segment" 
                axisLine={false} 
                tickLine={false} 
                width={80}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
              />
              <RechartsTooltip 
                cursor={{ fill: 'hsl(var(--accent))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value) => [`${value}%`, 'Conversion Rate']}
              />
              <Bar dataKey="conversionRate" radius={[0, 4, 4, 0]} barSize={24}>
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={1 - (index * 0.2)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
