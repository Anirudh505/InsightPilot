import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, BrainCircuit, ArrowRight, Zap } from 'lucide-react';

export function FeatureAIInsights({ isLoading }) {
  if (isLoading) return null;

  return (
    <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3 border-b border-primary/10">
        <CardTitle className="text-sm font-medium flex items-center text-primary">
          <Sparkles className="h-4 w-4 mr-2" />
          Feature Value Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold">Hidden Gem Detected</h4>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500">
              High Value
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            The <span className="font-semibold text-foreground">"Dashboard Export (CSV)"</span> feature has low overall adoption (12.4%), but users who trigger it are <span className="font-semibold text-primary">3.2x more likely to retain</span> past Day 30. It is a strong leading indicator for power users.
          </p>
          <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2">
            <span className="flex items-center text-muted-foreground">
              <BrainCircuit className="h-3 w-3 mr-1" /> 89% Confidence
            </span>
            <button className="text-primary hover:underline font-medium flex items-center gap-1">
              View Cohort <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold">Suggested Optimization</h4>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary">
              Action
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Surface the Export button more prominently in the UI. Move it from the settings dropdown to the primary dashboard header to increase discoverability.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}
