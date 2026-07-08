import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FeatureFilterBar } from '@/components/features/FeatureFilterBar';
import { FeatureOverviewCards } from '@/components/features/FeatureOverviewCards';
import { AdoptionTrendChart } from '@/components/features/AdoptionTrendChart';
import { FeatureUsageTable } from '@/components/features/FeatureUsageTable';
import { FeatureSegmentAnalysis } from '@/components/features/FeatureSegmentAnalysis';
import { FeatureAIInsights } from '@/components/features/FeatureAIInsights';
import { useFeatureAdoptionData, useFeatureBreakdown } from '@/hooks/queries/useFeatureAdoptionData';
import { useGlobalFilters } from '@/hooks/useGlobalFilters';
import { motion } from 'framer-motion';
import { fadeUp } from '@/animations/framer';

export default function FeatureAdoptionWorkspace() {
  const { projectId } = useParams();
  
  const { dateRange } = useGlobalFilters();
  
  const [featureFilter] = useState('all');
  const [breakdownDim, setBreakdownDim] = useState('plan');

  const { data, isLoading } = useFeatureAdoptionData(projectId, dateRange, featureFilter);
  const { data: breakdownData, isLoading: isLoadingBreakdown } = useFeatureBreakdown(projectId, breakdownDim);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 lg:-m-8">
      {/* Top Filter Bar (Sticky) */}
      <div className="shrink-0 z-10 shadow-sm">
        <FeatureFilterBar dateRange={dateRange} />
      </div>

      {/* Workspace Area (Scrollable) */}
      <div className="flex-1 overflow-auto bg-muted/10 p-6 lg:p-8">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          className="mx-auto max-w-7xl space-y-6"
        >
          {/* Top Overview Cards */}
          <motion.div variants={fadeUp}>
            <FeatureOverviewCards overview={data?.overview} isLoading={isLoading} />
          </motion.div>

          {/* Main Trend Chart */}
          <motion.div variants={fadeUp}>
            <AdoptionTrendChart data={data?.trendData} isLoading={isLoading} />
          </motion.div>

          {/* AI and Segments Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={fadeUp}>
              <FeatureSegmentAnalysis 
                dimension={breakdownDim}
                onChangeDimension={setBreakdownDim}
                data={breakdownData}
                isLoading={isLoadingBreakdown}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <FeatureAIInsights isLoading={isLoading} />
            </motion.div>
          </div>

          {/* Feature Directory Table */}
          <motion.div variants={fadeUp}>
            <FeatureUsageTable features={data?.features} isLoading={isLoading} />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
