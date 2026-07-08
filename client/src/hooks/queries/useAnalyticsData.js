import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Mocks granular time-series data for the investigation workspace.
 * In a real app, this would hit something like `/projects/:id/metrics/timeseries`
 */
export function useMetricTimeSeries(projectId, metric, dateRange, granularity, segment) {
  return useQuery({
    queryKey: ['analytics-timeseries', projectId, metric, dateRange, granularity, segment],
    queryFn: async () => {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data generator
      const data = [];
      const days = 30;
      let currentVal = metric === 'active_users' ? 5000 : 1500;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Add some random noise
        const noise = (Math.random() - 0.5) * (currentVal * 0.1);
        currentVal = Math.max(100, Math.floor(currentVal + noise));
        
        data.push({
          date: date.toISOString(),
          value: currentVal,
          compareValue: Math.max(100, Math.floor(currentVal * (0.8 + Math.random() * 0.4))) // Mock compare series
        });
      }
      
      return {
        data,
        summary: {
          current: data[data.length - 1].value,
          previous: data[0].value,
          growth: ((data[data.length - 1].value - data[0].value) / data[0].value) * 100
        }
      };
    },
    enabled: !!projectId && !!metric,
  });
}

/**
 * Mocks breakdown data (Country, Browser, etc)
 */
export function useMetricBreakdown(projectId, metric, dimension, dateRange) {
  return useQuery({
    queryKey: ['analytics-breakdown', projectId, metric, dimension, dateRange],
    queryFn: async () => {
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
