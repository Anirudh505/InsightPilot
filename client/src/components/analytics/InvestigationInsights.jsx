import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';

import { useInsights } from '@/hooks/queries/useInsights';
import { Loader2 } from 'lucide-react';

export function InvestigationInsights({ metric, projectId }) {
  const { data: backendInsights, isLoading } = useInsights(projectId, 3);
  
  // Format the insights from the backend to match the UI component structure
  const insights = backendInsights || [];

  return (
    <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3 border-b border-primary/10">
        <CardTitle className="text-sm font-medium flex items-center text-primary">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Investigation Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-4">
            No insights available yet.
          </div>
        ) : (
          insights.map((insight, i) => (
            <div key={i} className="bg-background/50 rounded-lg p-4 border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold">{insight.title || insight.type}</h4>
                {insight.impact && (
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${
                    insight.impact === 'High' || insight.impact === 'critical' ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {insight.impact}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {insight.description || insight.content}
              </p>
              <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2">
                <span className="flex items-center text-muted-foreground">
                  <BrainCircuit className="h-3 w-3 mr-1" /> {insight.confidence || 85}% Confidence
                </span>
                <button className="text-primary hover:underline font-medium flex items-center gap-1">
                  View Evidence <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
