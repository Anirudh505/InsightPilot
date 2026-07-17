import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export function useDashboardOverview(projectId, dateRange, segment) {
  return useQuery({
    queryKey: ['dashboard-overview', projectId, dateRange, segment],
    queryFn: async () => {
      const { data } = await api.get('/analytics/overview', {
        params: { projectId, range: dateRange || '30d' }
      });
      const overview = data.data;
      
      let totalDau = 0;
      if (overview.trends && overview.trends.length > 0) {
        totalDau = overview.trends.reduce((sum, day) => sum + (day.dau || 0), 0) / overview.trends.length;
      }
      
      const calcPrev = (current, growth) => {
        if (!current) return 0;
        return Math.round(current / (1 + (growth / 100)));
      };

      return {
        latestSnapshot: {
          activeUsers: Math.round(totalDau),
          totalEvents: overview.metrics?.totalEvents?.value || 0,
          averageSessionDuration: overview.metrics?.avgSessionDuration?.value || 0,
          topFeatures: []
        },
        previousSnapshot: {
          activeUsers: 0,
          totalEvents: calcPrev(overview.metrics?.totalEvents?.value, overview.metrics?.totalEvents?.growth),
          averageSessionDuration: calcPrev(overview.metrics?.avgSessionDuration?.value, overview.metrics?.avgSessionDuration?.growth),
        },
        historicalTrends: overview.trends?.map(t => ({
          date: t.date,
          activeUsers: t.dau || 0,
          totalEvents: t.events || 0
        })) || []
      };
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

export function useRealtimeMetrics(projectId) {
  return useQuery({
    queryKey: ['realtime-metrics', projectId],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectId}/dashboards/realtime`);
      return data.data;
    },
    enabled: !!projectId,
    refetchInterval: 15000, // Poll every 15 seconds
  });
}
