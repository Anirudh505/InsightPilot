import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/utils/format';

export function KPICard({ title, value, previousValue, type = 'number', isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    );
  }

  // Calculate percentage change
  let change = 0;
  if (previousValue && previousValue > 0) {
    change = ((value - previousValue) / previousValue) * 100;
  }

  const isPositive = change > 0;
  const isNegative = change < 0;
  
  const formattedValue = type === 'currency' ? formatCurrency(value) : formatNumber(value);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <div className="text-3xl font-bold">{formattedValue}</div>
        
        <div className="mt-4 flex items-center text-sm">
          {isPositive ? (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+{change.toFixed(1)}%</span>
            </div>
          ) : isNegative ? (
            <div className="flex items-center text-destructive font-medium">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>{change.toFixed(1)}%</span>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground font-medium">
              <Minus className="h-4 w-4 mr-1" />
              <span>0%</span>
            </div>
          )}
          <span className="text-muted-foreground ml-2">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
