import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart4,
  Users,
  Mail,
  MessageSquare,
  Bell,
  KeyRound,
  Settings,
  Shield,
  ActivitySquare,
  X,
  User
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.roles?.includes('Administrator') || user?.roles?.includes('Admin');
  const basePrefix = isAdmin ? '/admin' : '/client';
  const dashboardNavigation = [
    { name: 'Dashboard', href: `${basePrefix}/dashboard`, icon: BarChart4 },
  ];

  const userManagementNavigation = [
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Roles', href: '/admin/roles', icon: Shield },
    { name: '2FA Security', href: '/admin/security/two-factor', icon: KeyRound },
    { name: 'Activities', href: '/admin/activity', icon: ActivitySquare },
  ];

  const communicationNavigation = [
    { name: 'OTP', href: '/admin/otp', icon: KeyRound },
    { name: 'Email', href: '/admin/email', icon: Mail },
    { name: 'SMS', href: '/admin/sms', icon: MessageSquare },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  ];

  const settingsNavigation = [
    { name: 'Settings', href: `${basePrefix}/settings`, icon: Settings },
  ];

  const clientNavigation = [
    { name: 'Dashboard', href: '/client/dashboard', icon: BarChart4 },
    { name: 'Profile', href: '/client/profile', icon: User },
    { name: 'Notifications', href: '/client/notifications', icon: Bell },
    { name: 'Settings', href: '/client/settings', icon: Settings },
  ];

  const adminNavigationWithSeparators = [
    { type: 'items', items: dashboardNavigation },
    { type: 'separator' },
    { type: 'items', items: userManagementNavigation },
    { type: 'separator' },
    { type: 'items', items: communicationNavigation },
    { type: 'separator' },
    { type: 'items', items: settingsNavigation },
  ];

  const navigation = isAdmin ? adminNavigationWithSeparators : clientNavigation;

  const sidebarVariants = {
    closed: {
      x: -300,
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* Mobile backdrop with blur effect */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" />
        </motion.div>
      )}

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card/95 backdrop-blur-sm border-r border-border shadow-lg transition-transform lg:translate-x-0 lg:static lg:shadow-none lg:w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-border">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">A</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-foreground">Admin Panel</h1>
            </div>

            {/* Close button - only on mobile */}
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 px-3 space-y-1.5">
              {isAdmin ? (
                navigation.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    {section.type === 'separator' ? (
                      <div className="h-px bg-border my-4 mx-2" />
                    ) : (
                      section.items.map((item) => (
                        <motion.div key={item.name} variants={itemVariants}>
                          <NavLink
                            to={item.href}
                            end
                            onClick={() => {
                              if (window.innerWidth < 1024) {
                                setOpen(false);
                              }
                            }}
                            className={({ isActive }) => {
                              return `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-muted'}`;
                            }}
                          >
                            {({ isActive }) => (
                              <>
                                <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                <span>{item.name}</span>
                                {isActive && (
                                  <motion.div
                                    className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full"
                                    layoutId="sidebar-indicator"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                  />
                                )}
                              </>
                            )}
                          </NavLink>
                        </motion.div>
                      ))
                    )}
                  </div>
                ))
              ) : (
                navigation.map((item) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <NavLink
                      to={item.href}
                      end
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          setOpen(false);
                        }
                      }}
                      className={({ isActive }) => {
                        return `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'}`;
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                          <span>{item.name}</span>
                          {isActive && (
                            <motion.div
                              className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full"
                              layoutId="sidebar-indicator"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))
              )}
            </nav>
          </div>

          <div className="flex-shrink-0 border-t border-border p-4 m-2 rounded-lg bg-muted/40">
            <div className="w-full group">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-foreground">{user?.userName || 'User'}</p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin ? 'Administrator' : 'Client'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
