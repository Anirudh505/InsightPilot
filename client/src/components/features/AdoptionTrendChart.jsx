import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDate } from '@/utils/format';

export function AdoptionTrendChart({ data, isLoading }) {
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
        <CardTitle className="text-sm font-medium">Global Feature Adoption Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(val) => formatDate(val, { month: 'short', day: 'numeric' })}
              minTickGap={30}
            />
            
            {/* Left Y-Axis for Volume */}
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            {/* Right Y-Axis for Percentage */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--primary))', fontSize: 12 }}
              tickFormatter={(val) => `${val}%`}
              domain={[0, 100]}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ fontWeight: 500 }}
              labelFormatter={(label) => formatDate(label, { month: 'short', day: 'numeric', year: 'numeric' })}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            {/* Stacked Bars for Usage Volume */}
            <Bar yAxisId="left" dataKey="firstTime" stackId="a" fill="#8b5cf6" name="First-Time Users" radius={[0, 0, 4, 4]} />
            <Bar yAxisId="left" dataKey="returning" stackId="a" fill="hsl(var(--secondary-foreground))" name="Returning Users" radius={[4, 4, 0, 0]} />
            
            {/* Line for Adoption Percentage */}
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="adoptionRate" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={false}
              name="Adoption Rate %" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
