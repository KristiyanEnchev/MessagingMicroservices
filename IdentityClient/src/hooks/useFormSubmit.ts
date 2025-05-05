import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ZodSchema } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';


export function handleApiError(error: any, _errorMessage: string): string {
  if (error?.data?.message) return error.data.message;
  if (error?.message) return error.message;
  return 'An unknown error occurred';
}

interface FormSubmitOptions<_TFormData, TResponse> {
  onSuccess?: (data: TResponse) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  resetForm?: boolean;
}

export function useFormSubmit<TFormData extends FieldValues, TResponse>(
  submitFn: (data: TFormData) => Promise<TResponse>,
  form: UseFormReturn<TFormData>,
  options: FormSubmitOptions<TFormData, TResponse> = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    onSuccess,
    onError,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
    resetForm = false,
  } = options;

  const handleSubmit = async (formData: TFormData) => {
    setIsSubmitting(true);

    try {
      const result = await submitFn(formData);

      if (successMessage) {
        toast.success(successMessage);
      }

      if (resetForm) {
        form.reset();
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error: any) {
      handleApiError(error, errorMessage);

      if (onError) {
        onError(error);
      }

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    formState: form.formState,
  };
}

export function validateWithSchema<T>(schema: ZodSchema<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Form validation error:', error);
    return null;
  }
}
