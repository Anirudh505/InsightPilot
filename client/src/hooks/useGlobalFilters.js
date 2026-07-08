import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * A hook to manage global filter state synchronized with the URL.
 * Allows users to share links with specific filters applied and maintain
 * filter context when navigating between different analytic views.
 */
export function useGlobalFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current state with logical defaults
  const dateRange = useMemo(() => {
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    
    if (start && end) {
      return { start, end };
    }
    
    // Default to last 30 days
    return {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    };
  }, [searchParams]);

  const segment = searchParams.get('segment') || 'all';

  // Action creators
  const setDateRange = useCallback((start, end) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('start', start);
      next.set('end', end);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setSegment = useCallback((newSegment) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (newSegment === 'all') {
        next.delete('segment');
      } else {
        next.set('segment', newSegment);
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('start');
      next.delete('end');
      next.delete('segment');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  return {
    dateRange,
    segment,
    setDateRange,
    setSegment,
    resetFilters
  };
}
