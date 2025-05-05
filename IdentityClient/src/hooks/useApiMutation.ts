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
  const {
    toastSuccess = true,
    successMessage = 'Operation completed successfully',
    toastError = true,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mutate, { isLoading, isError, reset: resetMutation }] = mutationHook();

  const execute = async (args: any): Promise<T | null> => {
    try {
      const response = await mutate(args);
      let result;
      
      if (typeof (response as any).unwrap === 'function') {
        result = await (response as any).unwrap();
      } else if ('data' in response) {
        result = response.data;
      } else {
        result = response;
      }

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

  const reset = () => {
    setData(null);
    setError(null);
    resetMutation();
  };

  return {
    data,
    isLoading,
    isError,
    error,
    execute,
    reset,
  };
}
