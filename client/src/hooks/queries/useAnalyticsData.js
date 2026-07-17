import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Fetches time-series data using the real backend analytics overview.
 */
export function useMetricTimeSeries(projectId, metric, dateRange, granularity, segment) {
  return useQuery({
    queryKey: ['analytics-timeseries', projectId, metric, dateRange, granularity, segment],
    queryFn: async () => {
      const { data } = await api.get('/analytics/overview', {
        params: {
          projectId,
          range: dateRange || '30d'
        }
      });
      
      const payload = data.data; // { dateRange, metrics, trends }
      
      // Map trends to the expected format
      const formattedData = payload.trends.map(day => {
        let val = 0;
        if (metric === 'active_users') val = day.dau;
        else if (metric === 'total_events') val = day.events;
        else if (metric === 'sessions') val = day.sessions;
        
        return {
          date: day.date,
          value: val || 0,
          // compareValue could be added if backend provided previous period daily trends, 
          // for now we'll mock compare trend line shape based on value
          compareValue: Math.max(0, Math.floor(val * (0.8 + Math.random() * 0.4))) 
        };
      });
      
      let summary = { current: 0, previous: 0, growth: 0 };
      if (metric === 'active_users' && payload.metrics?.totalSessions) {
         // Proxy for DAU growth if not directly provided in metrics
         summary = {
           current: formattedData.length > 0 ? formattedData[formattedData.length - 1].value : 0,
           previous: formattedData.length > 0 ? formattedData[0].value : 0,
           growth: payload.metrics.totalSessions.growth
         };
      } else if (metric === 'total_events' && payload.metrics?.totalEvents) {
         summary = payload.metrics.totalEvents;
         summary.current = summary.value; // Map backend 'value' to frontend 'current'
      }

      return {
        data: formattedData,
        summary
      };
    },
    enabled: !!projectId && !!metric,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetches breakdown data (Events, Country, Browser, etc)
 */
export function useMetricBreakdown(projectId, metric, dimension, dateRange) {
  return useQuery({
    queryKey: ['analytics-breakdown', projectId, metric, dimension, dateRange],
    queryFn: async () => {
      // If the dimension is events, use the real backend endpoint
      if (dimension === 'events') {
        const { data } = await api.get('/analytics/events', {
          params: { projectId, range: dateRange || '30d' }
        });
        
        // Map backend { name, count } to frontend { label, value, percentage }
        const totalCount = data.data.reduce((acc, curr) => acc + curr.count, 0);
        return data.data.map(e => ({
          label: e.name,
          value: e.count,
          percentage: totalCount > 0 ? Math.round((e.count / totalCount) * 100) : 0
        }));
      }

      // For country/browser/device where backend aggregations don't exist yet, fallback to mock
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockBreakdowns = {
        country: [
          { label: 'United States', value: 4521, percentage: 45 },
          { label: 'United Kingdom', value: 2100, percentage: 21 },
          { label: 'Germany', value: 1500, percentage: 15 },
          { label: 'India', value: 950, percentage: 9.5 },
          { label: 'Other', value: 929, percentage: 9.5 },
        ],
        browser: [
          { label: 'Chrome', value: 6500, percentage: 65 },
          { label: 'Safari', value: 2000, percentage: 20 },
          { label: 'Firefox', value: 1000, percentage: 10 },
          { label: 'Edge', value: 500, percentage: 5 },
        ],
        device: [
          { label: 'Desktop', value: 5500, percentage: 55 },
          { label: 'Mobile', value: 4000, percentage: 40 },
          { label: 'Tablet', value: 500, percentage: 5 },
        ]
      };
      
      return mockBreakdowns[dimension] || mockBreakdowns.country;
    },
    enabled: !!projectId && !!metric && !!dimension,
  });
}
