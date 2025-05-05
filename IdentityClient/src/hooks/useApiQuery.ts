import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

type QueryState<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
};

export function useApiQuery<T, P = void>(
  queryHook: (params: P) => {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    refetch: () => void;
  },
  params: P,
  options: {
    toastError?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
): QueryState<T> {
  const { toastError = true, onSuccess, onError } = options;
  const [isMounted, setIsMounted] = useState(true);
  const { data, isLoading, isError, error, refetch } = queryHook(params);

  useEffect(() => {
    if (!isMounted) return;

    if (data && onSuccess) {
      onSuccess(data);
    }

    if (isError && error) {
      const errorMessage = error.data?.message || error.error || 'An error occurred';

      if (toastError) {
        toast.error(errorMessage);
      }

      if (onError) {
        onError(errorMessage);
      }
    }

    return () => {
      setIsMounted(false);
    };
  }, [data, isError, error, isMounted, onSuccess, onError, toastError]);

  return {
    data: data || null,
    isLoading,
    isError,
    error: isError ? (error.data?.message || error.error || 'An error occurred') : null,
    refetch,
  };
}
