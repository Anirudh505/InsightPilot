import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { formatDate } from '@/utils/format';

export function EventDetailsDrawer({ event, onClose }) {
  if (!event) return null;

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full md:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-lg">{event.name}</h3>
          <p className="text-xs text-muted-foreground">{formatDate(event.timestamp, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Event Details</h4>
          <div className="bg-muted/30 rounded-md border border-border p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-mono">{event.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-xs text-muted-foreground">{event.id}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Properties Payload</h4>
          <div className="bg-[#1e1e1e] rounded-md border border-border p-4 overflow-x-auto">
            <pre className="text-xs text-[#d4d4d4] font-mono leading-relaxed">
              {JSON.stringify(event.properties, null, 2)}
            </pre>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
