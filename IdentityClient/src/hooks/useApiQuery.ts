import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

type QueryState<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * A custom hook for handling API query state and errors
 * @param queryHook - The RTK Query hook to use
 * @param params - Parameters to pass to the query hook
 * @param options - Additional options
 * @returns Query state with error handling
 */
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
  // Default options
  const { toastError = true, onSuccess, onError } = options;
  
  // Track if component is mounted to avoid state updates after unmount
  const [isMounted, setIsMounted] = useState(true);
  
  // Execute the query hook
  const { data, isLoading, isError, error, refetch } = queryHook(params);
  
  // Handle success and error effects
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
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      setIsMounted(false);
    };
  }, [data, isError, error, isMounted, onSuccess, onError, toastError]);
  
  // Return the query state
  return {
    data: data || null,
    isLoading,
    isError,
    error: isError ? (error.data?.message || error.error || 'An error occurred') : null,
    refetch,
  };
}
