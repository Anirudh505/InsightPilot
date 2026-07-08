import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDate } from '@/utils/format';

export function LifecycleOverview({ data, isLoading }) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="h-[350px] pt-4">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0 border-b border-border/50">
        <CardTitle className="text-sm font-medium">User Lifecycle State</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(val) => formatDate(val, { month: 'short', day: 'numeric' })}
              minTickGap={30}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ fontWeight: 500 }}
              labelFormatter={(label) => formatDate(label, { month: 'short', day: 'numeric', year: 'numeric' })}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            <Area type="monotone" dataKey="new" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="New Users" />
            <Area type="monotone" dataKey="resurrected" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Reactivated" />
            <Area type="monotone" dataKey="active" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" name="Active" />
            <Area type="monotone" dataKey="dormant" stackId="1" stroke="#ef4444" fill="#ef4444" name="Dormant" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
