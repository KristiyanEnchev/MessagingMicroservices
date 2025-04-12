import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ZodSchema } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { handleApiError } from '../lib/api/apiUtils';

interface FormSubmitOptions<TFormData, TResponse> {
  onSuccess?: (data: TResponse) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  resetForm?: boolean;
}

/**
 * Custom hook for standardized form submission handling with RTK Query mutations
 */
export function useFormSubmit<TFormData, TResponse>(
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
      
      // Show success message
      if (successMessage) {
        toast.success(successMessage);
      }
      
      // Reset form if requested
      if (resetForm) {
        form.reset();
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error: any) {
      // Handle error with standardized error utility
      handleApiError(error, errorMessage);
      
      // Call error callback if provided
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

/**
 * Helper function to validate a form with Zod schema
 * This creates a consistent validation approach across all forms
 */
export function validateWithSchema<T>(schema: ZodSchema<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Form validation error:', error);
    return null;
  }
}
