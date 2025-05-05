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

  const result = useQueryHook(skipInitialLoad && isFirstLoad ? undefined : args, {
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

  useEffect(() => {
    if (data && !isFetching && onSuccess) {
      onSuccess(data);
      setIsFirstLoad(false);
    }

    if (error && !isFetching && onError) {
      onError(error);
    }
  }, [data, error, isFetching, onSuccess, onError]);

  useEffect(() => {
    if (!requiresRefresh) return;

    const intervalId = setInterval(() => {
      refetch();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refetch, requiresRefresh, refreshInterval]);

  return {
    ...result,
    isLoading: isLoading || isFetching,
    load: () => {
      setIsFirstLoad(false);
    },
  };
}
