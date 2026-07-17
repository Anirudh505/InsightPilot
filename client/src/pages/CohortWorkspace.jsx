import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';
import { Users, AlertTriangle } from 'lucide-react';

export default function CohortWorkspace() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cohorts</h1>
          <p className="text-muted-foreground mt-2">
            Build and manage behavioral user cohorts for deeper analysis.
          </p>
        </div>
      </div>

      <motion.div variants={fadeUp} className="h-96 flex flex-col items-center justify-center text-center p-8 bg-muted/10 border border-border/50 rounded-xl">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Cohort Builder Coming Soon</h2>
        <p className="text-muted-foreground max-w-md">
          Advanced behavioral cohorts are currently in development. Soon you will be able to group users by any combination of events, traits, and lifecycle stages, and save them for reuse across all your InsightPilot reports.
        </p>
      </motion.div>
    </motion.div>
  );
}
