import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';
import { RealtimeSummary } from '@/components/dashboard/RealtimeSummary';
import { useRealtimeMetrics } from '@/hooks/queries/useDashboard';

export default function RealtimeWorkspace() {
  const { projectId } = useParams();
  const { data: realtimeData, isLoading } = useRealtimeMetrics(projectId);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Realtime Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Live pulse of your application activity over the last 15 minutes.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">Live</span>
        </div>
      </div>

      <motion.div variants={fadeUp}>
        <RealtimeSummary data={realtimeData} isLoading={isLoading} />
      </motion.div>
      
      {/* We can add a live event stream table here in the future */}
      <motion.div variants={fadeUp} className="mt-8 p-12 bg-muted/20 border border-border/50 rounded-xl flex flex-col items-center justify-center text-center">
        <div className="text-muted-foreground mb-2">Live Event Stream coming soon</div>
        <p className="text-sm text-muted-foreground/70 max-w-md">
          A live feed of incoming events, sessions, and user behaviors will appear here as they are ingested by the InsightPilot tracking API.
        </p>
      </motion.div>
    </motion.div>
  );
}
