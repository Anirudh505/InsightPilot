import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ReportsWorkspace() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Reports</h1>
          <p className="text-muted-foreground mt-2">
            Access and manage your saved and scheduled reports.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      <motion.div variants={fadeUp} className="h-96 flex flex-col items-center justify-center text-center p-8 bg-muted/10 border border-border/50 rounded-xl">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Reports Generated</h2>
        <p className="text-muted-foreground max-w-md">
          You haven't saved any reports yet. Once you build interesting views in Analytics, Funnels, or Journeys, you can save them here for quick access or schedule them for automated email delivery.
        </p>
      </motion.div>
    </motion.div>
  );
}
