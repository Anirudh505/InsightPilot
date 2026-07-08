import React from 'react';
import { Button } from '@/components/ui/Button';
import { Calendar, Filter, Users } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/utils/format';

export function RetentionFilterBar({ dateRange }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b border-border bg-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary hidden sm:block" />
          <Select 
            className="h-9 w-[180px]" 
            value="all" 
            onChange={() => {}}
            options={[
              { label: 'All Users', value: 'all' },
              { label: 'Black Friday Cohort', value: 'c1' },
              { label: 'Organic Search', value: 'c2' }
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
            className="h-9 w-[140px]" 
            value="daily" 
            onChange={() => {}}
            options={[
              { label: 'Daily (Days)', value: 'daily' },
              { label: 'Weekly (Weeks)', value: 'weekly' },
              { label: 'Monthly (Months)', value: 'monthly' }
            ]} 
          />
        </div>
      </div>
    </div>
  );
}
