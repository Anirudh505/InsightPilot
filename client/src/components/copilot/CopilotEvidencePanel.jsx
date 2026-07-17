import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BrainCircuit, Link2, ExternalLink, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CopilotEvidencePanel({ evidence, onActionClick, isTyping }) {
  if (!evidence) {
    return (
      <div className="w-full h-full bg-muted/10 border-l border-border p-6 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <BrainCircuit className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-sm font-semibold mb-1">No Active Context</h3>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Ask a question in the chat, and I will display the supporting evidence here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-muted/10 border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border/50 bg-card sticky top-0 z-10">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" /> Analysis Context
        </h3>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Reasoning Section */}
        <section>
          <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-3">
            Analytical Reasoning
          </h4>
          <Card className="border-border/50 shadow-none bg-background/50">
            <CardContent className="p-4 text-xs leading-relaxed text-foreground">
              {evidence.reasoning}
            </CardContent>
            <div className="px-4 py-2 bg-muted/30 border-t border-border/50 flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground font-medium">Confidence Score</span>
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                {evidence.confidence}% High
              </span>
            </div>
          </Card>
        </section>

        {/* Data Evidence Section */}
        <section>
          <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-3">
            Supporting Evidence
          </h4>
          <div className="space-y-2">
            {evidence.metrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card">
                <span className="text-xs font-medium">{metric.label}</span>
                <span className={`text-sm font-bold ${metric.trend === 'down' ? 'text-destructive' : 'text-emerald-500'}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Artifacts Section */}
        <section>
          <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-3">
            Referenced Artifacts
          </h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-between h-auto py-3 px-4 bg-card hover:bg-accent border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold">Core Onboarding Funnel</div>
                  <div className="text-[10px] text-muted-foreground">Source of conversion drop</div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button variant="outline" className="w-full justify-between h-auto py-3 px-4 bg-card hover:bg-accent border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-secondary-foreground shrink-0">
                  <Link2 className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold">Paid Social (Q3) Cohort</div>
                  <div className="text-[10px] text-muted-foreground">Target Segment</div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </section>

        {/* Recommendations Section */}
        <section>
          <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-3">
            Suggested Actions
          </h4>
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardContent className="p-4 space-y-3">
              <div className="text-xs font-medium">Create A/B Test for Tooltip</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Test forcing the team invite modal after profile creation versus a dismissible tooltip.
              </p>
              <Button 
                size="sm" 
                className="w-full h-8 text-xs" 
                onClick={() => onActionClick?.("Draft an experiment plan for testing the team invite modal versus a dismissible tooltip to see which yields better conversion.")}
                disabled={isTyping}
              >
                Draft Experiment <ArrowRight className="h-3 w-3 ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
