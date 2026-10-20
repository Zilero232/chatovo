import { QueryClient } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { isUnauthorizedError } from './http';

const MAX_QUERY_RETRIES = 1;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        !isUnauthorizedError(error) && failureCount < MAX_QUERY_RETRIES,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: secondsToMilliseconds(60)
    },
    mutations: {
      retry: false
    }
  }
});
