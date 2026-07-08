import React from 'react';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Filter, SlidersHorizontal, Download, RotateCcw, Save } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/utils/format';

export function AnalyticsFilterBar({ dateRange, granularity, segment, onGranularityChange, onSegmentChange }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b border-border bg-card">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" className="h-9">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatDate(dateRange.start)} - {formatDate(dateRange.end)}</span>
        </Button>

        <div className="h-4 w-[1px] bg-border hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select 
            className="h-9 w-[120px]" 
            value={granularity} 
            onChange={(e) => onGranularityChange(e.target.value)}
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' }
            ]} 
          />
        </div>

        <div className="h-4 w-[1px] bg-border hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select 
            className="h-9 w-[160px]" 
            value={segment} 
            onChange={(e) => onSegmentChange(e.target.value)}
            options={[
              { label: 'All Users', value: 'all' },
              { label: 'New Signups', value: 'new' },
              { label: 'Active Users', value: 'active' },
              { label: 'Power Users', value: 'power' }
            ]} 
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-9">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Save className="h-4 w-4 mr-2" /> Save View
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="h-4 w-4" />
        </Button>
        <Button size="sm" className="h-9">
          <SlidersHorizontal className="h-4 w-4 mr-2" /> More Filters
        </Button>
      </div>
    </div>
  );
}
