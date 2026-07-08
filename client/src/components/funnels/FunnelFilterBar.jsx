import React from 'react';
import { Button } from '@/components/ui/Button';
import { Calendar, Filter, Save, Layers } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/utils/format';

export function FunnelFilterBar({ dateRange }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b border-border bg-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary hidden sm:block" />
          <Select 
            className="h-9 w-[220px] border-primary/20 bg-primary/5" 
            value="onboarding" 
            onChange={() => {}}
            options={[
              { label: 'Core Onboarding Funnel', value: 'onboarding' },
              { label: 'Checkout Flow', value: 'checkout' },
              { label: 'Feature Discovery', value: 'feature' }
            ]} 
          />
        </div>

        <div className="h-4 w-[1px] bg-border hidden sm:block"></div>

        <Button variant="outline" size="sm" className="h-9">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatDate(dateRange.start)} - {formatDate(dateRange.end)}</span>
        </Button>

        <div className="h-4 w-[1px] bg-border hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select 
            className="h-9 w-[160px]" 
            value="all" 
            onChange={() => {}}
            options={[
              { label: 'All Users', value: 'all' },
              { label: 'Desktop Only', value: 'desktop' },
              { label: 'Mobile Only', value: 'mobile' }
            ]} 
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Save className="h-4 w-4 mr-2" /> Save Funnel
        </Button>
      </div>
    </div>
  );
}
