import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/services/auth/authSlice';

const NotFound = () => {
  const user = useAppSelector(selectCurrentUser);
  const dashboardLink = user?.roles.includes('Administrator') ? '/admin/dashboard' : '/client/dashboard';

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <h1 className="text-6xl font-bold text-blue-500 mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to={user ? dashboardLink : "/login"}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {user ? "Return to Dashboard" : "Go to Login"}
      </Link>
    </div>
  );
};

export default NotFound;
