import { useCallback, useEffect } from 'react';
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
import { AuthResponse, LoginRequest, User } from '@/types/authTypes';
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
      const result = await loginMutation(credentials).unwrap();

      if (result.requiresTwoFactor) {
        navigate('/two-factor', {
          state: {
            email: credentials.email,
            userId: result.userId,
            transactionId: result.transactionId
          }
        });
        return result;
      }

      dispatch(setCredentials(result));
      toast.success('Login successful');

      const role = (result.user?.role || result.data?.role || '');
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
      await logoutMutation().unwrap();
      dispatch(logoutUser());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logoutUser());
      navigate('/login');
    }
  }, [dispatch, logoutMutation, navigate]);

  const updateUser = useCallback((userUpdate: Partial<typeof user>) => {
    toast.info('User update functionality not implemented');
  }, [user]);

  const completeTwoFactor = useCallback((authResponse: AuthResponse) => {
    dispatch(setCredentials(authResponse));
    const role = (authResponse.user?.role || authResponse.data?.role || '');
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
