import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, ArrowRight, TrendingDown } from 'lucide-react';

export function RetentionAIInsights({ isLoading }) {
  if (isLoading) return null;

  return (
    <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3 border-b border-primary/10">
        <CardTitle className="text-sm font-medium flex items-center text-primary">
          <Sparkles className="h-4 w-4 mr-2" />
          Retention Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold">High Churn Segment</h4>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-destructive/10 text-destructive">
              Critical
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Users joining from the <span className="font-semibold text-foreground">"Paid Social (Q3)"</span> cohort have a 45% lower Day-7 retention rate compared to organic traffic. This cohort is driving the recent spike in overall churn.
          </p>
          <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2">
            <span className="flex items-center text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-destructive" /> Costing ~$4.5k MRR
            </span>
            <button className="text-primary hover:underline font-medium flex items-center gap-1">
              Analyze Segment <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold">Suggested Action</h4>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary">
              Recommendation
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Implement a Day-3 re-engagement email specifically for Paid Social signups, highlighting the core value proposition they missed during onboarding.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}
