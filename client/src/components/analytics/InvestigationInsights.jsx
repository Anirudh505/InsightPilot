import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';

export function InvestigationInsights({ metric }) {
  // Mock AI data specific to the workspace investigation
  const insights = [
    {
      title: 'Sudden Drop in UK Traffic',
      description: 'Active users from the United Kingdom dropped by 15% starting yesterday. This correlates with a spike in error rates on the checkout service in the eu-west region.',
      confidence: 92,
      impact: 'High'
    },
    {
      title: 'Power Users Favoring Safari',
      description: 'The "Power Users" segment has a disproportionately high usage of Safari (45%) compared to the general baseline (20%).',
      confidence: 85,
      impact: 'Medium'
    }
  ];

  return (
    <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3 border-b border-primary/10">
        <CardTitle className="text-sm font-medium flex items-center text-primary">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Investigation Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="bg-background/50 rounded-lg p-4 border border-border/50">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold">{insight.title}</h4>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${
                insight.impact === 'High' ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {insight.impact}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {insight.description}
            </p>
            <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2">
              <span className="flex items-center text-muted-foreground">
                <BrainCircuit className="h-3 w-3 mr-1" /> {insight.confidence}% Confidence
              </span>
              <button className="text-primary hover:underline font-medium flex items-center gap-1">
                View Evidence <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
