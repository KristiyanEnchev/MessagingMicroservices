import React, { useState } from 'react';
import {
  Save,
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

const ClientSettings = () => {
  const { user, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [profileForm, setProfileForm] = useState({
    name: user?.userName || '',
    email: user?.email || '',
    phoneNumber: '',
    bio: '',
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    activitySummary: true,
    securityAlerts: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      updateUser({ userName: profileForm.name });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        {/* Success message */}
        {showSuccessMessage && (
          <div className="bg-green-600 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-md flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Changes saved successfully!
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <a href="#profile" className="bg-gray-700 text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <User className="text-gray-300 mr-3 flex-shrink-0 h-6 w-6" />
                <span className="truncate">Profile</span>
              </a>
              <a href="#notifications" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <Bell className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6" />
                <span className="truncate">Notifications</span>
              </a>
              <a href="#password" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <Lock className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6" />
                <span className="truncate">Password</span>
              </a>
              <a href="#appearance" className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                {isDarkMode ? (
                  <Moon className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6" />
                ) : (
                  <Sun className="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6" />
                )}
                <span className="truncate">Appearance</span>
              </a>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <section id="profile" className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                    Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-400"
                      placeholder="your.email@example.com"
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleProfileChange}
                      className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1">
                    Bio (Optional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className="bg-gray-700 block w-full py-2 px-3 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                      placeholder="Tell us a little about yourself"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Notifications Section */}
            <section id="notifications" className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-400">Receive email notifications about account activity</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      id="emailNotifications"
                      checked={notificationPreferences.emailNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">SMS Notifications</h3>
                    <p className="text-sm text-gray-400">Receive text message alerts for important updates</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      id="smsNotifications"
                      checked={notificationPreferences.smsNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Activity Summary</h3>
                    <p className="text-sm text-gray-400">Receive weekly summaries of account activity</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="activitySummary"
                      id="activitySummary"
                      checked={notificationPreferences.activitySummary}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Security Alerts</h3>
                    <p className="text-sm text-gray-400">Receive notifications about security-related events</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="securityAlerts"
                      id="securityAlerts"
                      checked={notificationPreferences.securityAlerts}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccessMessage(true);
                      setTimeout(() => setShowSuccessMessage(false), 3000);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </section>

            {/* Password Section */}
            <section id="password" className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-400 mb-1">
                    Current Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="bg-gray-700 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </form>
            </section>

            {/* Appearance Section */}
            <section id="appearance" className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-400">Toggle between dark and light theme</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <span className="sr-only">Toggle dark mode</span>
                      <span
                        className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;
