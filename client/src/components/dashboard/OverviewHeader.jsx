import React from 'react';
import { Button } from '@/components/ui/Button';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { formatDate } from '@/utils/format';

export function OverviewHeader({ isLoading, onRefresh, dateRange }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Executive Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening with your product today.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </span>
        </Button>
        
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} className="h-9">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>

        <Button size="sm" className="h-9">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
