import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('If an account with that email exists, we have sent instructions to reset your password.');
      setEmail('');
    } catch (error: any) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
        <p className="text-muted-foreground mt-1">Enter your email to reset your password</p>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mb-4" icon={<AlertTriangle className="h-4 w-4" />}>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="mb-4" icon={<Check className="h-4 w-4" />}>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending email...' : 'Send reset link'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Remember your password?</span>{' '}
        <Link to="/auth/login" className="font-medium text-primary hover:text-primary/90">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
