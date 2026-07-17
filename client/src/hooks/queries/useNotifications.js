import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const MOCK_NOTIFICATIONS = [
  {
    id: 'n_1',
    title: 'New AI Insight Available',
    message: 'InsightPilot detected a 14% anomaly in your active users trend.',
    type: 'insight',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'n_2',
    title: 'Report Generated',
    message: 'Your Q3 Product Metrics report is ready to view.',
    type: 'report',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'n_3',
    title: 'New Team Member',
    message: 'Jane Doe joined the Acme Corp workspace.',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];

// In-memory store for the frontend mock
let notificationsStore = [...MOCK_NOTIFICATIONS];

export function useNotifications(projectId) {
  const queryClient = useQueryClient();
  const queryKey = ['notifications', projectId];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...notificationsStore];
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      notificationsStore = notificationsStore.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      return notificationsStore;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(queryKey, newData);
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      notificationsStore = notificationsStore.map(n => ({ ...n, isRead: true }));
      return notificationsStore;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(queryKey, newData);
      toast.success("All notifications marked as read");
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id) => {
      notificationsStore = notificationsStore.filter(n => n.id !== id);
      return notificationsStore;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(queryKey, newData);
      toast.success("Notification deleted");
    }
  });

  const unreadCount = query.data?.filter(n => !n.isRead).length || 0;

  return {
    ...query,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate
  };
}
