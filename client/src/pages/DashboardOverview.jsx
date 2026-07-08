import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDashboardOverview, useRealtimeMetrics } from '@/hooks/queries/useDashboard';
import { useInsights } from '@/hooks/queries/useInsights';
import { OverviewHeader } from '@/components/dashboard/OverviewHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { RealtimeSummary } from '@/components/dashboard/RealtimeSummary';
import { AIInsightHighlight } from '@/components/dashboard/AIInsightHighlight';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { useGlobalFilters } from '@/hooks/useGlobalFilters';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';

export default function DashboardOverview() {
  const { projectId } = useParams();
  
  const { dateRange, segment, setDateRange, setSegment } = useGlobalFilters();

  const { data: overviewData, isLoading: isLoadingOverview, refetch } = useDashboardOverview(projectId, dateRange, segment);
  const { data: realtimeData, isLoading: isLoadingRealtime } = useRealtimeMetrics(projectId);
  const { data: insightsData, isLoading: isLoadingInsights } = useInsights(projectId);

  // Extract data with fallbacks
  const snapshot = overviewData?.latestSnapshot || {};
  const prevSnapshot = overviewData?.previousSnapshot || {};
  const trendData = overviewData?.historicalTrends || [];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <OverviewHeader 
        dateRange={dateRange} 
        onRefresh={() => refetch()} 
        isLoading={isLoadingOverview} 
      />

      {/* Top Section: Realtime & AI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} className="md:col-span-1">
          <RealtimeSummary data={realtimeData} isLoading={isLoadingRealtime} />
        </motion.div>
        <motion.div variants={fadeUp} className="md:col-span-2">
          <AIInsightHighlight insights={insightsData} isLoading={isLoadingInsights} />
        </motion.div>
      </div>

      {/* KPI Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Daily Active Users" 
          value={snapshot.activeUsers} 
          previousValue={prevSnapshot.activeUsers} 
          isLoading={isLoadingOverview} 
        />
        <KPICard 
          title="Total Events" 
          value={snapshot.totalEvents} 
          previousValue={prevSnapshot.totalEvents} 
          isLoading={isLoadingOverview} 
        />
        <KPICard 
          title="Avg Session Duration (s)" 
          value={snapshot.averageSessionDuration} 
          previousValue={prevSnapshot.averageSessionDuration} 
          isLoading={isLoadingOverview} 
        />
        <KPICard 
          title="Top Feature Uses" 
          value={snapshot.topFeatures?.length > 0 ? snapshot.topFeatures[0].count : 0} 
          previousValue={0} // Mock previous
          isLoading={isLoadingOverview} 
        />
      </motion.div>

      {/* Charts */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart 
          title="Active Users Trend" 
          data={trendData} 
          dataKey="activeUsers" 
          color="hsl(var(--primary))" 
          isLoading={isLoadingOverview} 
        />
        <TrendChart 
          title="Event Volume Trend" 
          data={trendData} 
          dataKey="totalEvents" 
          color="hsl(var(--secondary-foreground))" 
          isLoading={isLoadingOverview} 
        />
      </motion.div>
    </motion.div>
  );
}
