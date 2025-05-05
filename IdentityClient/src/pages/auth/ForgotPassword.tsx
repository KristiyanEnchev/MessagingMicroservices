import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call

      setEmailSent(true);
      showToast.success('Password reset link has been sent to your email');
    } catch (error: any) {
      showToast.error(error?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email to receive a password reset link"
      showBackLink={true}
    >
      {!emailSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            id="email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            placeholder="your.email@example.com"
            {...register('email')}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full"
          >
            Send Reset Link
          </Button>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Check your email</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            If you don't see the email, check other places it might be, like your junk, spam, or other folders.
          </p>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
