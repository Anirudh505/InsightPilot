import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const MOCK_REPORTS = [];

// In-memory store for the frontend mock
let reportsStore = [...MOCK_REPORTS];

export function useReports(projectId) {
  const queryClient = useQueryClient();
  const queryKey = ['reports', projectId];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...reportsStore];
    }
  });

  const createReportMutation = useMutation({
    mutationFn: async (newReport) => {
      const report = {
        ...newReport,
        id: 'r_' + Math.floor(Math.random() * 10000),
        createdAt: new Date().toISOString(),
      };
      reportsStore = [report, ...reportsStore];
      return reportsStore;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(queryKey, newData);
      toast.success("Report generated successfully");
    }
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (id) => {
      reportsStore = reportsStore.filter(r => r.id !== id);
      return reportsStore;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(queryKey, newData);
      toast.success("Report deleted");
    }
  });

  return {
    ...query,
    createReport: createReportMutation.mutate,
    deleteReport: deleteReportMutation.mutate
  };
}
