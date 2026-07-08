import React from 'react';
import { CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function FunnelChart({ steps, isLoading, onStepClick, activeStepId }) {
  if (isLoading) {
    return (
      <CardContent className="h-[400px] pt-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    );
  }

  if (!steps || steps.length === 0) return null;

  // Transform data for Recharts stacked bar
  const chartData = steps.map((step, index) => {
    // For the first step, entered === converted (baseline).
    // For subsequent steps, we show the converted portion, and the dropped off portion stacked on top.
    const isFirst = index === 0;
    return {
      name: step.name,
      id: step.id,
      converted: step.converted,
      dropped: isFirst ? 0 : step.droppedOff,
      total: step.entered,
      dropOffPercentage: step.dropOffPercentage
    };
  });

  return (
    <CardContent className="h-[400px] pt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
          />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--accent))' }}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: 'var(--tw-shadow-elevated)' }}
            itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
            formatter={(value, name) => [value, name === 'converted' ? 'Converted Users' : 'Dropped Off']}
          />
          
          <Bar dataKey="converted" stackId="a" onClick={(data) => onStepClick(data.id)} cursor="pointer">
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={activeStepId === entry.id || !activeStepId ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'} 
                className="transition-all duration-300"
              />
            ))}
          </Bar>
          
          <Bar dataKey="dropped" stackId="a" onClick={(data) => onStepClick(data.id)} cursor="pointer">
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-drop-${index}`} 
                fill={activeStepId === entry.id || !activeStepId ? 'hsl(var(--destructive) / 0.8)' : 'hsl(var(--destructive) / 0.2)'} 
                className="transition-all duration-300"
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
