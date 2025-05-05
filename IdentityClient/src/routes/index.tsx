import { lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';
import PageWrapper from '@/components/common/PageWrapper';

// Admin pages
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Users = lazy(() => import('@/pages/admin/users/Users'));
const UserDetails = lazy(() => import('@/pages/admin/users/UserDetails'));
const EmailManagement = lazy(() => import('@/pages/admin/email/EmailManagement'));
const SMSManagement = lazy(() => import('@/pages/admin/sms/SMSManagement'));
const OTPManagement = lazy(() => import('@/pages/admin/otp/OTPManagement'));
const NotificationManagement = lazy(() => import('@/pages/admin/notifications/NotificationManagement'));
const Roles = lazy(() => import('@/pages/admin/roles/Roles'));
const ActivityLogs = lazy(() => import('@/pages/admin/activity/ActivityLogs'));
const TwoFactorSettings = lazy(() => import('@/pages/admin/security/TwoFactorSettings.tsx'));
const Settings = lazy(() => import('@/pages/admin/settings/Settings'));

const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const TwoFactorAuth = lazy(() => import('@/pages/auth/TwoFactorAuth'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));

const Profile = lazy(() => import('@/pages/client/Profile'));
const Notifications = lazy(() => import('@/pages/client/Notifications'));
const ClientDashboard = lazy(() => import('@/pages/client/Dashboard'));
const ClientSettings = lazy(() => import('@/pages/client/Settings'));

const Landing = lazy(() => import('@/pages/public/Landing'));
const NotFound = lazy(() => import('@/pages/errors/NotFound'));

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page as root */}
      <Route path="/" element={<PageWrapper component={Landing} />} />

      {/* Auth Layout Routes */}
      <Route element={
        <GuestRoute>
          <AuthLayout />
        </GuestRoute>
      }>
        <Route path="auth">
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<PageWrapper component={Login} />} />
          <Route path="register" element={<PageWrapper component={Register} />} />
          <Route path="reset-password" element={<PageWrapper component={ResetPassword} />} />
          <Route path="two-factor" element={<PageWrapper component={TwoFactorAuth} />} />
          <Route path="forgot-password" element={<PageWrapper component={ForgotPassword} />} />
        </Route>
      </Route>

      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        {/* Admin Routes */}
        <Route path="admin" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <AnimatePresence mode="wait">
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PageWrapper component={Dashboard} />
              </motion.div>
            </AnimatePresence>
          } />
          <Route path="users" element={<PageWrapper component={Users} />} />
          <Route path="users/:id" element={<PageWrapper component={UserDetails} />} />
          <Route path="email" element={<PageWrapper component={EmailManagement} />} />
          <Route path="sms" element={<PageWrapper component={SMSManagement} />} />
          <Route path="otp" element={<PageWrapper component={OTPManagement} />} />
          <Route path="notifications" element={<PageWrapper component={NotificationManagement} />} />
          <Route path="roles" element={<PageWrapper component={Roles} />} />
          <Route path="activity" element={<PageWrapper component={ActivityLogs} />} />
          <Route path="security/two-factor" element={<PageWrapper component={TwoFactorSettings} />} />
          <Route path="settings" element={<PageWrapper component={Settings} />} />
        </Route>

        {/* Client Routes */}
        <Route path="client" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PageWrapper component={ClientDashboard} />} />
          <Route path="profile" element={<PageWrapper component={Profile} />} />
          <Route path="notifications" element={<PageWrapper component={Notifications} />} />
          <Route path="settings" element={<PageWrapper component={ClientSettings} />} />
        </Route>
      </Route>

      {/* No additional landing page route needed since it's already on root */}

      {/* 404 Route */}
      <Route path="*" element={<PageWrapper component={NotFound} />} />
    </Routes>
  );
}
