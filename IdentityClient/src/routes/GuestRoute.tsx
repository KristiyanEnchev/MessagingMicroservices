import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { useEffect, useState } from 'react';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [persistLoaded, setPersistLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPersistLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  if (!persistLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    const isAdmin = user?.roles && Array.isArray(user.roles) && 
                   (user.roles.includes('Admin') || user.roles.includes('Administrator'));
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/client/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};