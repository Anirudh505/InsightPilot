import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnalyticsFilterBar } from '@/components/analytics/AnalyticsFilterBar';
import { MetricHeader } from '@/components/analytics/MetricHeader';
import { MainChart } from '@/components/analytics/MainChart';
import { BreakdownPanel } from '@/components/analytics/BreakdownPanel';
import { SegmentPanel } from '@/components/analytics/SegmentPanel';
import { InvestigationInsights } from '@/components/analytics/InvestigationInsights';
import { useMetricTimeSeries, useMetricBreakdown } from '@/hooks/queries/useAnalyticsData';
import { useGlobalFilters } from '@/hooks/useGlobalFilters';
import { motion } from 'framer-motion';
import { fadeUp } from '@/animations/framer';
import { Card } from '@/components/ui/Card';

export default function AnalyticsWorkspace() {
  const { projectId } = useParams();
  
  const { dateRange, segment, setDateRange, setSegment } = useGlobalFilters();
  
  const [metric, setMetric] = useState('active_users');
  const [granularity, setGranularity] = useState('daily');
  const [breakdownDim, setBreakdownDim] = useState('country');

  // Fetch Data
  const { data: tsData, isLoading: isLoadingTs } = useMetricTimeSeries(projectId, metric, dateRange, granularity, segment);
  const { data: breakdownData, isLoading: isLoadingBreakdown } = useMetricBreakdown(projectId, metric, breakdownDim, dateRange);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 lg:-m-8">
      {/* Top Filter Bar (Sticky) */}
      <div className="shrink-0 z-10">
        <AnalyticsFilterBar 
          dateRange={dateRange}
          granularity={granularity}
          onGranularityChange={setGranularity}
          segment={segment}
          onSegmentChange={setSegment}
        />
      </div>

      {/* Workspace Area (Scrollable) */}
      <div className="flex-1 overflow-auto bg-muted/10 p-6 lg:p-8">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          className="mx-auto max-w-7xl space-y-6"
        >
          {/* Header & Main Chart */}
          <motion.div variants={fadeUp}>
            <Card className="overflow-hidden border-border/50 shadow-sm">
              <MetricHeader 
                metricName={metric === 'active_users' ? 'Active Users' : 'Total Events'} 
                summary={tsData?.summary} 
                isLoading={isLoadingTs} 
              />
              <MainChart 
                data={tsData?.data} 
                isLoading={isLoadingTs} 
                showCompare={true} 
              />
            </Card>
          </motion.div>

          {/* Deep Dive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Segments */}
            <motion.div variants={fadeUp} className="lg:col-span-3">
              <SegmentPanel 
                activeSegment={segment} 
                onSegmentChange={setSegment} 
              />
            </motion.div>

            {/* Middle: Breakdowns */}
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <BreakdownPanel 
                dimension={breakdownDim}
                onChangeDimension={setBreakdownDim}
                data={breakdownData}
                isLoading={isLoadingBreakdown}
              />
            </motion.div>

            {/* Right: AI Insights */}
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <InvestigationInsights metric={metric} projectId={projectId} />
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
