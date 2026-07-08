import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export function BreakdownPanel({ dimension, data, isLoading, onChangeDimension }) {
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
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  const dimensions = [
    { id: 'country', label: 'Country' },
    { id: 'browser', label: 'Browser' },
    { id: 'device', label: 'Device' },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-0 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Breakdown by</CardTitle>
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
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                width={100}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
              />
              <RechartsTooltip 
                cursor={{ fill: 'hsl(var(--accent))' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value) => [`${value}`, 'Volume']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={1 - (index * 0.15)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
