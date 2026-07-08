import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function AIInsightHighlight({ insights, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-40 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return null; // Don't show if no insights
  }

  const topInsight = insights[0]; // The most recent critical insight

  return (
    <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-amber-600 dark:text-amber-400">AI Copilot Insight</h3>
            <Badge variant="warning" className="ml-2 bg-amber-500/20">{topInsight.type}</Badge>
          </div>
        </div>
        
        <h4 className="text-lg font-bold mt-2">{topInsight.title}</h4>
        <p className="text-muted-foreground mt-1 text-sm">{topInsight.description}</p>
        
        {topInsight.recommendations && topInsight.recommendations.length > 0 && (
          <div className="mt-4 p-3 bg-background rounded-md border border-border shadow-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <span className="text-sm font-medium">Recommendation: </span>
                <span className="text-sm text-muted-foreground">{topInsight.recommendations[0].title}</span>
              </div>
            </div>
          </div>
        )}

        <button className="mt-4 text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
          View all insights <ArrowRight className="h-3 w-3" />
        </button>
      </CardContent>
    </Card>
  );
}
