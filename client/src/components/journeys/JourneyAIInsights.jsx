import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export function JourneyAIInsights({ isLoading }) {
  if (isLoading) return null;

  return (
    <Card className="sticky top-6 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
      <CardHeader className="pb-3 border-b border-amber-500/10">
        <CardTitle className="text-sm font-medium flex items-center text-amber-600 dark:text-amber-400">
          <Sparkles className="h-4 w-4 mr-2" />
          Journey Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        
        <div className="bg-background/80 rounded-lg p-3 border border-border/50 text-sm">
          <div className="flex items-center gap-2 mb-2 font-semibold text-destructive">
            <AlertCircle className="h-4 w-4" /> Drop-off Risk Detected
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            User experienced 2 validation errors on the pricing page before bouncing in Session 2. This pattern is shared by 14% of similar churned users.
          </p>
        </div>

        <div className="bg-background/80 rounded-lg p-3 border border-border/50 text-sm">
          <div className="flex items-center gap-2 mb-2 font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Positive Signal
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            User returned within 48 hours and immediately utilized the "Export" feature, indicating strong intent.
          </p>
        </div>

        <button className="w-full mt-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 py-2 rounded-md transition-colors flex items-center justify-center gap-1">
          View Full AI Report <ArrowRight className="h-3 w-3" />
        </button>

      </CardContent>
    </Card>
  );
}
