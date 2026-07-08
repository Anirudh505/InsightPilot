import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export function useDashboardOverview(projectId, dashboardId) {
  return useQuery({
    queryKey: ['dashboard-overview', projectId, dashboardId],
    queryFn: async () => {
      // If we don't have a specific dashboard ID, we might fetch a default one or pass a placeholder "default"
      const id = dashboardId || 'default';
      const { data } = await api.get(`/projects/${projectId}/dashboards/${id}/overview`);
      return data.data;
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
