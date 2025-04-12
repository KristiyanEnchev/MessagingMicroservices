import { useEffect, useState } from 'react';
import { QueryDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { 
  QueryHooks, 
  QueryResult, 
  QueryCacheKey 
} from '@reduxjs/toolkit/dist/query/react/buildHooks';

interface UseFetchOptions<TData> {
  skipInitialLoad?: boolean;
  initialData?: TData;
  onSuccess?: (data: TData) => void;
  onError?: (error: any) => void;
  requiresRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * A standardized hook for data fetching with RTK Query
 * Provides consistent loading, error handling, and automatic refresh
 */
export function useFetch<
  TArgs, 
  TData, 
  TError = unknown
>(
  useQueryHook: (...args: any[]) => QueryResult<QueryDefinition<TArgs, any, any, TData>>,
  args: TArgs,
  options: UseFetchOptions<TData> = {}
) {
  const {
    skipInitialLoad = false,
    initialData,
    onSuccess,
    onError,
    requiresRefresh = false,
    refreshInterval = 30000, // Default to 30 seconds
  } = options;

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Execute the query hook
  const result = useQueryHook(skipInitialLoad && isFirstLoad ? undefined : args, {
    // Return cached data when possible
    refetchOnMountOrArgChange: true,
    skip: skipInitialLoad && isFirstLoad,
  });

  const { 
    data, 
    error, 
    isLoading, 
    isFetching,
    refetch
  } = result;

  // Handle success and error callbacks
  useEffect(() => {
    if (data && !isFetching && onSuccess) {
      onSuccess(data);
      setIsFirstLoad(false);
    }

    if (error && !isFetching && onError) {
      onError(error);
    }
  }, [data, error, isFetching, onSuccess, onError]);

  // Set up periodic refresh if needed
  useEffect(() => {
    if (!requiresRefresh) return;

    const intervalId = setInterval(() => {
      refetch();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refetch, requiresRefresh, refreshInterval]);

  return {
    ...result,
    // Provide a more intuitive loading state that combines isLoading and isFetching
    isLoading: isLoading || isFetching,
    // Provide a way to force load if initial load was skipped
    load: () => {
      setIsFirstLoad(false);
    },
  };
}
