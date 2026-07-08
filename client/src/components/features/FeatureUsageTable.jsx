import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/utils/format';

export function FeatureUsageTable({ features, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  const getRetentionBadge = (correlation) => {
    switch (correlation) {
      case 'high': return <Badge variant="success">High Impact</Badge>;
      case 'medium': return <Badge variant="default" className="bg-primary/20 text-primary">Moderate</Badge>;
      case 'low': return <Badge variant="secondary">Low Impact</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 border-b border-border bg-muted/10">
        <CardTitle className="text-sm font-medium">Feature Performance Directory</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-card border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">Feature Name</th>
              <th className="px-6 py-4 font-semibold text-right">Adoption %</th>
              <th className="px-6 py-4 font-semibold text-right">Unique Users</th>
              <th className="px-6 py-4 font-semibold text-right">Usage Volume</th>
              <th className="px-6 py-4 font-semibold text-right">30-Day Trend</th>
              <th className="px-6 py-4 font-semibold text-center">Retention Correlation</th>
              <th className="px-6 py-4 font-semibold text-right">Time to First Use</th>
            </tr>
          </thead>
          <tbody>
            {features?.map((feature) => (
              <tr key={feature.id} className="border-b border-border/50 hover:bg-accent transition-colors group cursor-pointer">
                <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                  {feature.name}
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  {feature.adoption.toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                  {formatNumber(feature.users)}
                </td>
                <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                  {formatNumber(feature.volume)}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center font-medium ${feature.trend > 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                    {feature.trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(feature.trend)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {getRetentionBadge(feature.retentionCorrelation)}
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                  {feature.timeToFirstUse}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
