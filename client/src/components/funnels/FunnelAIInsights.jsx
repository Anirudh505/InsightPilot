import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';

export function FunnelAIInsights({ funnelData, isLoading }) {
  if (isLoading || !funnelData) return null;

  return (
    <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3 border-b border-primary/10">
        <CardTitle className="text-sm font-medium flex items-center text-primary">
          <Sparkles className="h-4 w-4 mr-2" />
          Conversion Bottleneck Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold">Critical Drop-off Detected</h4>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-destructive/10 text-destructive">
              High Impact
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            The largest drop-off occurs at <span className="font-semibold text-foreground">Step 4 (Invited Team Member)</span>, losing 69.5% of users. The median time to complete this step is unusually high (24 hours), suggesting users are waiting on external actions before proceeding.
          </p>
          <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2">
            <span className="flex items-center text-muted-foreground">
              <BrainCircuit className="h-3 w-3 mr-1" /> 94% Confidence
            </span>
          </div>
        </div>

        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold">Suggested Optimization</h4>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary">
              Recommendation
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Implement a "Skip for now" option during the team invite step. Users who bypass this step initially have a 3x higher likelihood of returning to complete it later.
          </p>
          <div className="flex items-center justify-end text-xs border-t border-border/50 pt-2">
            <button className="text-primary hover:underline font-medium flex items-center gap-1">
              Create A/B Test <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
