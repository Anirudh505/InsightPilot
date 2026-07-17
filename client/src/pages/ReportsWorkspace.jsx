import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';
import { FileText, Download, Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useReports } from '@/hooks/queries/useReports';
import { ReportBuilderModal } from '@/components/reports/ReportBuilderModal';
import { formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';

export default function ReportsWorkspace() {
  const { projectId } = useParams();
  const { data: reports, isLoading, createReport, deleteReport } = useReports(projectId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Reports</h1>
          <p className="text-muted-foreground mt-2">
            Access and manage your saved and scheduled reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" disabled={!reports || reports.length === 0}>
            <Download className="w-4 h-4" />
            Export All
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-muted-foreground">Loading reports...</div>
      ) : !reports || reports.length === 0 ? (
        <motion.div variants={fadeUp} className="h-96 flex flex-col items-center justify-center text-center p-8 bg-muted/10 border border-border/50 rounded-xl">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Reports Generated</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            You haven't saved any reports yet. Build a new report to summarize your data for quick access or export.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Create First Report</Button>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="group bg-card border border-border hover:border-primary/50 transition-colors rounded-xl p-5 flex flex-col h-48">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteReport(report.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <h3 className="font-semibold text-lg line-clamp-1">{report.title}</h3>
              
              <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                <div className="flex items-center gap-1.5 capitalize">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {report.source}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(report.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <ReportBuilderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={createReport} 
      />
    </motion.div>
  );
}
