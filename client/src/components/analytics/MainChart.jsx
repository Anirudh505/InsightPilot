import React from 'react';
import { CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Brush } from 'recharts';
import { formatDate } from '@/utils/format';

export function MainChart({ data, isLoading, showCompare = true }) {
  if (isLoading) {
    return (
      <CardContent className="h-[450px] pt-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    );
  }

  if (!data || data.length === 0) {
    return (
      <CardContent className="h-[450px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available for this period.</p>
      </CardContent>
    );
  }

  return (
    <CardContent className="h-[450px] pt-4 pb-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            {showCompare && (
              <linearGradient id="colorCompare" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(val) => formatDate(val, { month: 'short', day: 'numeric' })}
            minTickGap={30}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: 'var(--tw-shadow-elevated)' }}
            itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '8px' }}
            labelFormatter={(label) => formatDate(label, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          
          {showCompare && (
            <Area 
              type="monotone" 
              name="Previous Period"
              dataKey="compareValue" 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCompare)" 
              isAnimationActive={false}
            />
          )}
          <Area 
            type="monotone" 
            name="Current Period"
            dataKey="value" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCurrent)" 
          />
          <Brush 
            dataKey="date" 
            height={30} 
            stroke="hsl(var(--primary))"
            fill="hsl(var(--card))"
            tickFormatter={(val) => formatDate(val, { month: 'short', day: 'numeric' })}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
