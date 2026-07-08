import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export function useInsights(projectId, limit = 5) {
  return useQuery({
    queryKey: ['insights', projectId, limit],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectId}/ai/insights?limit=${limit}`);
      return data.data;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 mins
  });
}
