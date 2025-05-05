import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  logoutUser,
  setCredentials
} from '@/services/auth/authSlice';
import { useLoginMutation, useLogoutMutation } from '@/services/auth/authApi';
import { AuthResponse, LoginRequest } from '@/types/authTypes';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectAuthLoading);

  const [loginMutation, loginMutationResult] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const safeCredentials = { ...credentials, rememberMe: credentials.rememberMe ?? false } as import('@/services/auth/authApi').LoginRequest;
      const response = await loginMutation(safeCredentials);
      const result = response.data as AuthResponse;

      if (result.requiresTwoFactor || result.requires_2fa) {
        navigate('/two-factor', {
          state: {
            email: credentials.email,
            userId: result.userId || result.data?.userId,
            transactionId: result.transactionId || result.data?.transactionId
          }
        });
        return result;
      }

      dispatch(setCredentials(result));
      toast.success('Login successful');

      const role = (result.user?.roles || result.data?.role || '');
      const redirectPath = role === 'Administrator' ? '/admin/dashboard' : '/client/dashboard';
      navigate(redirectPath);

      return result;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  }, [dispatch, loginMutation, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation({ email: user?.email || '' });
      dispatch(logoutUser());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logoutUser());
      navigate('/login');
    }
  }, [dispatch, logoutMutation, navigate]);

  const updateUser = useCallback((_userUpdate: Partial<typeof user>) => {
    // This function is not currently implemented
  }, [user]);

  const completeTwoFactor = useCallback((authResponse: AuthResponse) => {
    dispatch(setCredentials(authResponse as AuthResponse));
    const role = (authResponse.user?.roles || authResponse.data?.role || '');
    const redirectPath = role === 'Administrator' ? '/admin/dashboard' : '/client/dashboard';
    navigate(redirectPath);
    toast.success('Authentication successful');
  }, [dispatch, navigate]);

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout: handleLogout,
    updateUser,
    completeTwoFactor,
    loginResult: loginMutationResult,
  };
};
