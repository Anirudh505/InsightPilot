import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FunnelFilterBar } from '@/components/funnels/FunnelFilterBar';
import { FunnelChart } from '@/components/funnels/FunnelChart';
import { FunnelDataTable } from '@/components/funnels/FunnelDataTable';
import { SegmentComparison } from '@/components/funnels/SegmentComparison';
import { FunnelAIInsights } from '@/components/funnels/FunnelAIInsights';
import { useFunnelData, useFunnelBreakdown } from '@/hooks/queries/useFunnelData';
import { useGlobalFilters } from '@/hooks/useGlobalFilters';
import { motion } from 'framer-motion';
import { fadeUp } from '@/animations/framer';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export default function FunnelWorkspace() {
  const { projectId } = useParams();
  
  // Funnel State
  const [funnelId] = useState('f_onboarding');
  const { dateRange, segment } = useGlobalFilters();
  
  // Interactive State
  const [activeStepId, setActiveStepId] = useState(null);
  const [breakdownDim, setBreakdownDim] = useState('device');

  // Fetch Data
  const { data: funnelData, isLoading: isLoadingFunnel } = useFunnelData(projectId, funnelId, dateRange, segment);
  const { data: breakdownData, isLoading: isLoadingBreakdown } = useFunnelBreakdown(projectId, funnelId, breakdownDim);

  const handleStepClick = (stepId) => {
    setActiveStepId(activeStepId === stepId ? null : stepId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 lg:-m-8">
      {/* Top Filter Bar (Sticky) */}
      <div className="shrink-0 z-10 shadow-sm">
        <FunnelFilterBar dateRange={dateRange} />
      </div>

      {/* Workspace Area (Scrollable) */}
      <div className="flex-1 overflow-auto bg-muted/10 p-6 lg:p-8">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          className="mx-auto max-w-7xl space-y-6"
        >
          {/* Main Visualization Header */}
          <motion.div variants={fadeUp} className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{funnelData?.name || 'Loading Funnel...'}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Overall Conversion Rate: <span className="font-semibold text-foreground">{funnelData?.totalConversion}%</span>
              </p>
            </div>
          </motion.div>

          {/* Main Funnel Chart */}
          <motion.div variants={fadeUp}>
            <Card className="overflow-hidden border-border/50 shadow-sm">
              <CardHeader className="pb-0 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-sm font-medium">Conversion Flow</CardTitle>
              </CardHeader>
              <FunnelChart 
                steps={funnelData?.steps} 
                isLoading={isLoadingFunnel} 
                onStepClick={handleStepClick}
                activeStepId={activeStepId}
              />
            </Card>
          </motion.div>

          {/* Data Table */}
          <motion.div variants={fadeUp}>
            <FunnelDataTable 
              steps={funnelData?.steps} 
              isLoading={isLoadingFunnel}
              activeStepId={activeStepId}
              onStepClick={handleStepClick}
            />
          </motion.div>

          {/* Bottom Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Segment Comparison */}
            <motion.div variants={fadeUp}>
              <SegmentComparison 
                dimension={breakdownDim}
                onChangeDimension={setBreakdownDim}
                data={breakdownData}
                isLoading={isLoadingBreakdown}
              />
            </motion.div>

            {/* Right: AI Insights */}
            <motion.div variants={fadeUp}>
              <FunnelAIInsights funnelData={funnelData} isLoading={isLoadingFunnel} />
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
