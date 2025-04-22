import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  const [persistLoaded, setPersistLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPersistLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (token && !isAuthenticated && persistLoaded) {
      console.warn('Auth inconsistency detected: Has token but not authenticated', { token, isAuthenticated });
    }
  }, [token, isAuthenticated, persistLoaded]);
  if (!persistLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (requiredRoles && user?.roles && Array.isArray(user.roles)) {
    const isAdmin = user.roles.includes('Admin') || user.roles.includes('Administrator');
    
    // Allow admins to access client routes
    // Only check required roles if the user is not an admin or if we're accessing admin routes
    const isClientRoute = window.location.pathname.startsWith('/client');
    
    if (!isAdmin || !isClientRoute) {
      const hasRequiredRole = requiredRoles.some(role => 
        user.roles.includes(role)
      );
      
      if (!hasRequiredRole) {
        if (isAdmin) {
          return <Navigate to="/admin/dashboard" replace />;
        } else {
          return <Navigate to="/client/dashboard" replace />;
        }
      }
    }
  }
  
  return <>{children}</>;
};