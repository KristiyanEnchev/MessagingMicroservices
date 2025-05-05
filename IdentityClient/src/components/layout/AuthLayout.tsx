import { Link, Outlet } from 'react-router-dom';
import { Moon, Shield, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { toggleTheme } from '@/services/theme/themeSlice';
import { ReactNode } from 'react';


interface AuthLayoutProps {
  title: string;
  description: string;
  showBackLink: boolean;
  children: ReactNode;
}

export const AuthLayout = ({  }: AuthLayoutProps) => {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state: RootState) => state.theme);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
          </Link>
        </div>
        <button
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">A</span>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>

      <footer className="py-6 border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
