import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Prevents excessive API calls on tab switch
            retry: 1, // Only retry once on failure
            staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
            gcTime: 15 * 60 * 1000, // Keep inactive data in cache for 15 minutes (was cacheTime in v4, gcTime in v5)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}
