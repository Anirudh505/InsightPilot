import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Mocks granular funnel data
 */
export function useFunnelData(projectId, funnelId, dateRange, segment) {
  return useQuery({
    queryKey: ['funnel', projectId, funnelId, dateRange, segment],
    queryFn: async () => {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const steps = [
        {
          id: 'step_1',
          name: 'Visited Landing Page',
          entered: 15420,
          converted: 15420,
          droppedOff: 0,
          dropOffPercentage: 0,
          conversionPercentage: 100,
          medianTimeSeconds: 0
        },
        {
          id: 'step_2',
          name: 'Clicked Start Trial',
          entered: 15420,
          converted: 8200,
          droppedOff: 7220,
          dropOffPercentage: 46.8,
          conversionPercentage: 53.2,
          medianTimeSeconds: 120
        },
        {
          id: 'step_3',
          name: 'Completed Onboarding',
          entered: 8200,
          converted: 4100,
          droppedOff: 4100,
          dropOffPercentage: 50.0,
          conversionPercentage: 26.6, // overall
          medianTimeSeconds: 340
        },
        {
          id: 'step_4',
          name: 'Invited Team Member',
          entered: 4100,
          converted: 1250,
          droppedOff: 2850,
          dropOffPercentage: 69.5,
          conversionPercentage: 8.1, // overall
          medianTimeSeconds: 86400 // 1 day
        }
      ];

      return {
        id: funnelId || 'f_123',
        name: 'Core Onboarding Funnel',
        totalConversion: 8.1,
        steps
      };
    },
    enabled: !!projectId,
  });
}

/**
 * Mocks funnel dimension breakdowns
 */
export function useFunnelBreakdown(projectId, funnelId, dimension) {
  return useQuery({
    queryKey: ['funnel-breakdown', projectId, funnelId, dimension],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return [
        { segment: 'Desktop', conversionRate: 12.5, users: 8500 },
        { segment: 'Mobile Web', conversionRate: 4.2, users: 6920 },
      ];
    },
    enabled: !!projectId,
  });
}
