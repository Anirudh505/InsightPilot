import React from 'react';
import { Button } from '@/components/ui/Button';
import { Calendar, Search, SlidersHorizontal, Zap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/utils/format';

export function FeatureFilterBar({ dateRange }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="relative max-w-sm w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search features..." 
            className="pl-9 h-9"
          />
        </div>

        <div className="h-4 w-[1px] bg-border hidden sm:block"></div>

        <Button variant="outline" size="sm" className="h-9">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatDate(dateRange.start)} - {formatDate(dateRange.end)}</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-9 hidden md:flex text-primary">
          <Zap className="h-4 w-4 mr-2" />
          Power Users Only
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <SlidersHorizontal className="h-4 w-4 mr-2" /> 
          More Filters
        </Button>
      </div>
    </div>
  );
}
