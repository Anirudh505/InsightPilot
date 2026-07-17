import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, FileText, LineChart, Users, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ReportBuilderModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('analytics');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    
    onCreate({
      title,
      source,
      type: 'pdf',
    });
    
    setTitle('');
    setSource('analytics');
    onClose();
  };

  const sources = [
    { id: 'analytics', label: 'General Analytics', icon: LineChart },
    { id: 'funnel', label: 'Funnel Dropoff', icon: Filter },
    { id: 'cohort', label: 'Cohort Retention', icon: Users },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-card border border-border shadow-lg rounded-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="w-5 h-5 text-primary" />
            Create New Report
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 User Retention"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              autoFocus
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Data Source</label>
            <div className="grid gap-3">
              {sources.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                    source === s.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:bg-muted"
                  )}
                >
                  <s.icon className={cn("w-5 h-5", source === s.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="font-medium text-sm">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!title}>Generate Report</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
