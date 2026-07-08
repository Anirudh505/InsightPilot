import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RetentionFilterBar } from '@/components/retention/RetentionFilterBar';
import { RetentionOverview } from '@/components/retention/RetentionOverview';
import { RetentionHeatmap } from '@/components/retention/RetentionHeatmap';
import { LifecycleOverview } from '@/components/retention/LifecycleOverview';
import { CohortTable } from '@/components/retention/CohortTable';
import { RetentionAIInsights } from '@/components/retention/RetentionAIInsights';
import { useRetentionData } from '@/hooks/queries/useRetentionData';
import { useGlobalFilters } from '@/hooks/useGlobalFilters';
import { motion } from 'framer-motion';
import { fadeUp } from '@/animations/framer';

export default function RetentionWorkspace() {
  const { projectId } = useParams();
  
  const { dateRange, segment } = useGlobalFilters();

  const { data, isLoading } = useRetentionData(projectId, dateRange, segment);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 lg:-m-8">
      {/* Top Filter Bar (Sticky) */}
      <div className="shrink-0 z-10 shadow-sm">
        <RetentionFilterBar dateRange={dateRange} />
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
            <RetentionOverview overview={data?.overview} isLoading={isLoading} />
          </motion.div>

          {/* Main Heatmap */}
          <motion.div variants={fadeUp}>
            <RetentionHeatmap matrix={data?.matrix} isLoading={isLoading} />
          </motion.div>

          {/* Lifecycle & Cohort Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Lifecycle Chart */}
            <motion.div variants={fadeUp} className="lg:col-span-8">
              <LifecycleOverview data={data?.lifecycleData} isLoading={isLoading} />
            </motion.div>

            {/* Right: AI Insights */}
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <RetentionAIInsights isLoading={isLoading} />
            </motion.div>

          </div>

          {/* Bottom: Saved Cohorts Table */}
          <motion.div variants={fadeUp}>
            <CohortTable cohorts={data?.cohorts} isLoading={isLoading} />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
