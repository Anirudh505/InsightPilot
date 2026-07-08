import React from 'react';
import { Bookmark, Share2, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/utils/format';
import { Skeleton } from '@/components/ui/Skeleton';

export function MetricHeader({ metricName, summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="p-6 pb-2">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-12 w-32" />
      </div>
    );
  }

  if (!summary) return null;

  const isPositive = summary.growth > 0;
  const isNegative = summary.growth < 0;

  return (
    <div className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold tracking-tight">{metricName}</h1>
          <button className="text-muted-foreground hover:text-foreground">
            <Info className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-end gap-4 mt-2">
          <span className="text-5xl font-black tracking-tighter">
            {formatNumber(summary.current)}
          </span>
          
          <div className="flex flex-col pb-1">
            <div className={`flex items-center font-medium ${isPositive ? 'text-emerald-500' : isNegative ? 'text-destructive' : 'text-muted-foreground'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : isNegative ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
              {isPositive ? '+' : ''}{summary.growth.toFixed(1)}%
            </div>
            <span className="text-xs text-muted-foreground">vs previous period</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Bookmark className="h-4 w-4 mr-2 text-muted-foreground" />
          Bookmark
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Share2 className="h-4 w-4 mr-2 text-muted-foreground" />
          Share
        </Button>
      </div>
    </div>
  );
}
