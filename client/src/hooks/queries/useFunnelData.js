import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Fetches funnel data from the backend.
 * Uses the first funnel found for the project if funnelId is 'f_onboarding' or mock.
 */
export function useFunnelData(projectId, funnelId, dateRange, segment) {
  return useQuery({
    queryKey: ['funnel', projectId, funnelId, dateRange, segment],
    queryFn: async () => {
      // 1. Fetch all funnels for project
      const { data } = await api.get(`/projects/${projectId}/funnels`);
      const funnels = data.data || [];
      
      let targetFunnel = funnels.find(f => f._id === funnelId);
      
      // Fallback: just use the first funnel we find if the hardcoded one doesn't exist
      if (!targetFunnel && funnels.length > 0) {
        targetFunnel = funnels[0];
      }

      if (!targetFunnel) {
        // Return empty state if no funnels exist in DB
        return {
          id: funnelId,
          name: 'No Funnels Found',
          totalConversion: 0,
          steps: [],
          status: 'empty'
        };
      }

      // If calculation is running
      if (targetFunnel.calculationStatus === 'calculating') {
        return {
          id: targetFunnel._id,
          name: targetFunnel.name,
          totalConversion: 0,
          steps: [],
          status: 'calculating'
        };
      }

      const result = targetFunnel.lastResult;
      
      if (!result || !result.steps) {
        return {
          id: targetFunnel._id,
          name: targetFunnel.name,
          totalConversion: 0,
          steps: [],
          status: 'no_data'
        };
      }

      return {
        id: targetFunnel._id,
        name: targetFunnel.name,
        totalConversion: result.overallConversionRate || 0,
        steps: result.steps.map((step, idx) => ({
          id: `step_${idx}`,
          name: step.eventName,
          entered: step.count,
          converted: step.count, // backend only gives raw count in basic model
          droppedOff: idx > 0 ? (result.steps[idx - 1].count - step.count) : 0,
          dropOffPercentage: idx > 0 && result.steps[idx - 1].count > 0 
            ? ((result.steps[idx - 1].count - step.count) / result.steps[idx - 1].count) * 100 
            : 0,
          conversionPercentage: step.conversionRateFromPrevious || 0,
          medianTimeSeconds: step.avgTimeToConvert || 0
        })),
        status: 'success'
      };
    },
    enabled: !!projectId,
    refetchInterval: (data) => (data?.status === 'calculating' ? 5000 : false)
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
