import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertTriangle } from 'lucide-react';
import { useRegisterMutation } from '@/services/auth/authApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [register, { isLoading }] = useRegisterMutation();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    try {
      await register({ ...formData, rememberMe: false }).unwrap();
      navigate('/auth/login', { 
        state: { 
          message: 'Registration successful! Please check your email to confirm your account.' 
        } 
      });
    } catch (error: any) {
      let message = 'Registration failed. Please try again.';
      
      if (error.data?.message) {
        message = error.data.message;
      } else if (error.data?.errors) {
        const errors = error.data.errors;
        message = Object.values(errors).flat().join(', ');
      }
      
      setErrorMessage(message);
    }
  };
  
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        <p className="text-muted-foreground mt-1">Enter your information to create an account</p>
      </div>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4" icon={<AlertTriangle className="h-4 w-4" />}>
          <AlertDescription>{errorMessage}</AlertDescription>
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
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          />
          
          <Input
            label="Username"
            type="text"
            name="userName"
            id="userName"
            placeholder="johndoe"
            value={formData.userName}
            onChange={handleChange}
            required
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<Lock className="h-4 w-4 text-muted-foreground" />}
          />
          
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={<Lock className="h-4 w-4 text-muted-foreground" />}
          />
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                checked={formData.terms}
                onChange={handleChange}
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-foreground">
                I agree to the
              </label>{' '}
              <a href="#" className="text-primary hover:text-primary/90">
                Terms of Service
              </a>{' '}
              <span className="text-foreground">and</span>{' '}
              <a href="#" className="text-primary hover:text-primary/90">
                Privacy Policy
              </a>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{' '}
        <Link to="/auth/login" className="font-medium text-primary hover:text-primary/90">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;