import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function CohortTable({ cohorts, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 border-b border-border bg-muted/10">
        <CardTitle className="text-sm font-medium">Saved Cohorts Performance</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-card border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">Cohort Name</th>
              <th className="px-6 py-4 font-semibold text-right">Users</th>
              <th className="px-6 py-4 font-semibold text-right">Day 30 Retention</th>
              <th className="px-6 py-4 font-semibold text-right">Growth (MoM)</th>
              <th className="px-6 py-4 font-semibold text-right">Avg LTV</th>
            </tr>
          </thead>
          <tbody>
            {cohorts?.map((cohort) => (
              <tr key={cohort.id} className="border-b border-border/50 hover:bg-accent transition-colors">
                <td className="px-6 py-4 font-medium text-primary cursor-pointer hover:underline">
                  {cohort.name}
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {cohort.users.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  {cohort.day30Retention.toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center font-medium ${cohort.growth > 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                    {cohort.growth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(cohort.growth)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-medium">
                  {cohort.ltv}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
