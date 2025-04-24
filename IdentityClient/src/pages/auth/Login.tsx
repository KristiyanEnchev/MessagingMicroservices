import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, AlertTriangle } from 'lucide-react';
import { useLoginMutation } from '@/services/auth/authApi';
import { setCredentials } from '@/services/auth/authSlice';
import { store } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      // Get the raw response from the login API
      const responseData = await login(loginData).unwrap();
      console.log('Login API response:', responseData);

      // Normalize the response structure to handle different API response formats
      let normalizedResponse = responseData;

      // Check if the response is a direct token structure without nested data
      if (responseData.access_token && !responseData.success && !responseData.data) {
        normalizedResponse = {
          success: true,
          data: {
            access_token: responseData.access_token,
            token_type: responseData.token_type || 'Bearer',
            refresh_token: responseData.refresh_token,
            expires_in: responseData.expires_in,
            expires_at: responseData.expires_at || new Date(Date.now() + (responseData.expires_in * 1000)).toISOString(),
            requires_2fa: responseData.requires_2fa || false,
            userId: '',
            transactionId: ''
          },
          errors: null
        };
      }

      if (normalizedResponse.success === false || (normalizedResponse.errors && normalizedResponse.errors.length > 0)) {
        // Handle error response
        setErrorMessage(normalizedResponse.errors?.[0] || 'Login failed. Please check your credentials.');
        return;
      }

      // Handle 2FA requirement if present
      if (normalizedResponse.data?.requires_2fa) {
        navigate('/auth/two-factor', {
          state: {
            userId: normalizedResponse.data.userId || '',
            transactionId: normalizedResponse.data.transactionId || ''
          }
        });
        return;
      }

      // Update Redux state with credentials
      dispatch(setCredentials(normalizedResponse));

      // Get roles from Redux store after state update
      const { user } = store.getState().auth;
      const isAdmin = user?.roles?.some(role => ['Admin', 'Administrator'].includes(role));

      // Navigate based on user role
      navigate(isAdmin ? '/admin/dashboard' : '/client/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Login failed. Please check your credentials.';

      if (error.data?.errors?.length) {
        message = error.data.errors[0];
      } else if (error.status === 401) {
        message = 'Invalid email or password.';
      } else if (error.status === 403) {
        message = 'Your account is locked. Please contact support.';
      }

      setErrorMessage(message);
    }
  };



  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Sign in to your account</h1>
        <p className="text-muted-foreground mt-2">Enter your email below to sign in to your account</p>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            id="email"
            placeholder="name@example.com"
            value={loginData.email}
            onChange={handleChange}
            required
            leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            value={loginData.password}
            onChange={handleChange}
            required
            leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                checked={loginData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-muted-foreground">
                Remember me
              </label>
            </div>

            <Link to="/auth/forgot-password" className="text-sm font-medium text-primary hover:text-primary/90">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>{' '}
        <Link to="/auth/register" className="font-medium text-primary hover:text-primary/90">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
