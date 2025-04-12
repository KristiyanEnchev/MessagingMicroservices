import { useState } from 'react';
import { toast } from 'react-hot-toast';

type MutationState<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  execute: (args: any) => Promise<T | null>;
  reset: () => void;
};

/**
 * A custom hook for handling API mutation state and errors
 * @param mutationHook - The RTK Query mutation hook to use
 * @param options - Additional options
 * @returns Mutation state with error handling
 */
export function useApiMutation<T>(
  mutationHook: () => [
    (args: any) => Promise<any>,
    { 
      data?: T; 
      isLoading: boolean; 
      isError: boolean; 
      error?: any;
      reset: () => void;
    }
  ],
  options: {
    toastSuccess?: boolean;
    successMessage?: string;
    toastError?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
): MutationState<T> {
  // Default options
  const { 
    toastSuccess = true, 
    successMessage = 'Operation completed successfully', 
    toastError = true, 
    onSuccess, 
    onError 
  } = options;
  
  // Local state to avoid race conditions
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Execute the mutation hook
  const [mutate, { isLoading, isError, reset: resetMutation }] = mutationHook();
  
  // Wrapped execution function
  const execute = async (args: any): Promise<T | null> => {
    try {
      const result = await mutate(args).unwrap();
      
      // Handle success
      setData(result);
      setError(null);
      
      if (toastSuccess) {
        toast.success(
          result?.message || 
          (typeof result === 'object' && result?.succeeded ? result.message : successMessage)
        );
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err: any) {
      // Handle error
      const errorMessage = err.data?.message || err.error || 'An error occurred';
      setError(errorMessage);
      
      if (toastError) {
        toast.error(errorMessage);
      }
      
      if (onError) {
        onError(errorMessage);
      }
      
      return null;
    }
  };
  
  // Reset all state
  const reset = () => {
    setData(null);
    setError(null);
    resetMutation();
  };
  
  // Return the mutation state
  return {
    data,
    isLoading,
    isError,
    error,
    execute,
    reset,
  };
}
