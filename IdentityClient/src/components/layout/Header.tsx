import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Moon, 
  Sun, 
  Bell, 
  ChevronDown,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/services/auth/authSlice';
import { toggleTheme } from '@/services/theme/themeSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Header = ({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useDispatch();
  const { isDark } = useSelector((state: RootState) => state.theme);
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = async () => {
    try {
      if (user?.email) {
        await dispatch(logoutUser()).unwrap();
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to logout');
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-background/95 backdrop-blur-sm sticky top-0 z-30"
    >
      <div className="flex-1 flex items-center justify-between px-4 md:px-6 h-16 border-b border-border">
        <div className="flex items-center">
          <button
            className="mr-2 -ml-2 flex items-center justify-center p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center">
          <div ref={notificationsRef} className="relative">
            <button
              className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg py-1 border border-border z-20"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-medium text-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-border">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">New user registered</p>
                        <span className="text-xs text-muted-foreground">3 mins ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        User 'johndoe@example.com' has registered
                      </p>
                    </div>
                    <div className="px-4 py-2 border-b border-border">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">System update completed</p>
                        <span className="text-xs text-muted-foreground">1 hour ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        The system update has been completed successfully
                      </p>
                    </div>
                    <div className="px-4 py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Security alert</p>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Multiple failed login attempts detected
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-border">
                    <button className="w-full text-center text-xs text-primary font-medium hover:underline">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 ml-1"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div ref={userMenuRef} className="relative ml-1">
            <button
              className="flex items-center space-x-1 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {user?.userName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
            
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg py-1 border border-border z-20"
                >
                  <Link
                    to="/admin/profile"
                    className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Your Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Settings
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                    role="menuitem"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Sign out
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};