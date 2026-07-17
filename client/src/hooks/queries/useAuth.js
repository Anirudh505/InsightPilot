import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/api/axios';

const AUTH_KEYS = {
  all: ['auth'],
  user: () => [...AUTH_KEYS.all, 'user'],
};

// Fetch current logged-in user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_KEYS.user(),
    queryFn: async () => {
      const { data } = await axios.get('/auth/me');
      return data.data;
    },
    retry: false, // Don't retry if not authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await axios.post('/auth/login', credentials);
      return data.data; // Expected to contain { token, user }
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      queryClient.setQueryData(AUTH_KEYS.user(), data.user);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await axios.post('/auth/register', userData);
      return data.data;
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      queryClient.setQueryData(AUTH_KEYS.user(), data.user);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await axios.post('/auth/logout');
    },
    onSettled: () => {
      localStorage.removeItem('accessToken');
      queryClient.clear(); // Clear all cached data
      window.location.href = '/login';
    },
  });
};
