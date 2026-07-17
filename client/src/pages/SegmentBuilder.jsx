import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';
import { Users, Filter } from 'lucide-react';

export default function SegmentBuilder() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Segments</h1>
          <p className="text-muted-foreground mt-2">
            Define dynamic user segments to filter your reports.
          </p>
        </div>
      </div>

      <motion.div variants={fadeUp} className="h-96 flex flex-col items-center justify-center text-center p-8 bg-muted/10 border border-border/50 rounded-xl">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Filter className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Segment Builder Coming Soon</h2>
        <p className="text-muted-foreground max-w-md">
          Advanced dynamic segments are in development. You will be able to segment your user base on-the-fly based on properties like Geo-location, Device type, App version, and more.
        </p>
      </motion.div>
    </motion.div>
  );
}
