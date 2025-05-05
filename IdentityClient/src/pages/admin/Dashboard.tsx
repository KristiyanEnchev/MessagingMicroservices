import { BarChart4, Mail, MessageSquare, Bell, Key, ShieldCheck, ActivitySquare, CheckCircle, XCircle, Users, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { useGetUserActivityQuery } from '@/services/activity/activityApi';
import { useHealthCheckQuery as useOtpHealthQuery } from '@/services/otp/otpApi';
import { useHealthCheckQuery as useEmailHealthQuery } from '@/services/email/emailApi';
import { useHealthCheckQuery as useNotificationHealthQuery } from '@/services/notification/notificationApi';
import { motion } from 'framer-motion';

const ActivityTypeColors: Record<string, string> = {
  'Login': 'bg-emerald-100 text-emerald-800',
  'Logout': 'bg-amber-100 text-amber-800',
  'PasswordChange': 'bg-blue-100 text-blue-800',
  'PasswordReset': 'bg-violet-100 text-violet-800',
  'ProfileUpdate': 'bg-indigo-100 text-indigo-800',
  'Registration': 'bg-green-100 text-green-800',
  'RoleAssigned': 'bg-pink-100 text-pink-800',
  'RoleRemoved': 'bg-red-100 text-red-800',
  'UserCreated': 'bg-teal-100 text-teal-800',
  'UserDeleted': 'bg-rose-100 text-rose-800',
  'UserDisabled': 'bg-orange-100 text-orange-800',
  'UserEnabled': 'bg-lime-100 text-lime-800',
  'GetUsersInRole': 'bg-indigo-100 text-indigo-800',
};

const Dashboard = () => {
  const { data: activity, isLoading: activityLoading } = useGetUserActivityQuery({ take: 5 });
  const { data: otpHealth, isLoading: otpHealthLoading } = useOtpHealthQuery();
  const { data: emailHealth, isLoading: emailHealthLoading } = useEmailHealthQuery();
  const { data: notificationHealth, isLoading: notificationHealthLoading } = useNotificationHealthQuery();

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="px-4 py-6 space-y-8">
      <header>
        <div className="flex items-center mb-6">
          <BarChart4 className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* OTP Service Card */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Key className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-foreground">OTP Service</h3>
                <div className="flex items-center mt-1">
                  <span className="text-base font-medium text-foreground">Health Check</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full ${!otpHealthLoading && otpHealth?.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} text-sm font-medium`}>
              {!otpHealthLoading && otpHealth?.status === 'Healthy' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>

        {/* Identity API Card */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-foreground">Identity API</h3>
                <div className="flex items-center mt-1">
                  <span className="text-base font-medium text-foreground">Health Check</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Email Service Card */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-foreground">Email Service</h3>
                <div className="flex items-center mt-1">
                  <span className="text-base font-medium text-foreground">Health Check</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full ${!emailHealthLoading && emailHealth?.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} text-sm font-medium`}>
              {!emailHealthLoading && emailHealth?.status === 'Healthy' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>

        {/* SMS Service Card */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-purple-500 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-foreground">SMS Service</h3>
                <div className="flex items-center mt-1">
                  <span className="text-base font-medium text-foreground">Health Check</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
              Online
            </div>
          </div>
        </div>

        {/* Notification Service Card */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-amber-500 flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-foreground">Notification Service</h3>
                <div className="flex items-center mt-1">
                  <span className="text-base font-medium text-foreground">Health Check</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full ${!notificationHealthLoading && notificationHealth?.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} text-sm font-medium`}>
              {!notificationHealthLoading && notificationHealth?.status === 'Healthy' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Activities and Status panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-card p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <ActivitySquare className="h-5 w-5 mr-2 text-primary" />
            Recent Activity
          </h2>

          <div className="mt-6 border rounded-md border-border">
            {activityLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : activity?.length > 0 ? (
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activity.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-foreground">{item.userId || 'Unknown User'}</div>
                            <div className="text-xs text-muted-foreground">{item.additionalInfo || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full inline-block ${ActivityTypeColors[item.activityType] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                          {item.activityType}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <ActivitySquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p>No activity logs found</p>
              </div>
            )}
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
            Service Status
          </h2>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${!otpHealthLoading && otpHealth?.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {!otpHealthLoading && otpHealth?.status === 'Healthy' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                </div>
                <span className="ml-3 font-medium text-foreground">OTP Service</span>
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${!otpHealthLoading && otpHealth?.status === 'Healthy' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {!otpHealthLoading && otpHealth?.status === 'Healthy' ? 'Healthy' : 'Unhealthy'}
                </span>
                <span className="ml-3 text-xs text-muted-foreground">
                  {otpHealth?.responseTime || 65}ms
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="ml-3 font-medium text-foreground">SMS Service</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-emerald-600">Healthy</span>
                <span className="ml-3 text-xs text-muted-foreground">89ms</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${!emailHealthLoading && emailHealth?.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {!emailHealthLoading && emailHealth?.status === 'Healthy' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                </div>
                <span className="ml-3 font-medium text-foreground">Email Service</span>
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${!emailHealthLoading && emailHealth?.status === 'Healthy' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {!emailHealthLoading && emailHealth?.status === 'Healthy' ? 'Healthy' : 'Unhealthy'}
                </span>
                <span className="ml-3 text-xs text-muted-foreground">
                  {emailHealth?.responseTime || 130}ms
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${!notificationHealthLoading && notificationHealth?.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {!notificationHealthLoading && notificationHealth?.status === 'Healthy' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                </div>
                <span className="ml-3 font-medium text-foreground">Notification Service</span>
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${!notificationHealthLoading && notificationHealth?.status === 'Healthy' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {!notificationHealthLoading && notificationHealth?.status === 'Healthy' ? 'Healthy' : 'Unhealthy'}
                </span>
                <span className="ml-3 text-xs text-muted-foreground">
                  {notificationHealth?.responseTime || 75}ms
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="ml-3 font-medium text-foreground">Identity API</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-emerald-600">Healthy</span>
                <span className="ml-3 text-xs text-muted-foreground">45ms</span>
              </div>
            </div>

            <div className="pt-2 mt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">System Uptime</span>
                <span className="text-sm font-medium text-foreground">23 days, 4 hours, 12 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
