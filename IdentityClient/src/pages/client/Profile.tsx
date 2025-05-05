import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Key,
  Shield,
  Save,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'twoFactor'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.isTwoFactorEnabled || false);
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState('');
  const [qrCodeUrl] = useState('https://via.placeholder.com/200x200'); // Placeholder for QR code

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
    reset: resetProfile,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitProfile = async (data: ProfileFormValues) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const onSubmitPassword = async (data: PasswordFormValues) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const setupTwoFactor = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSetupStep(2);
    } catch (error) {
      toast.error('Failed to setup 2FA');
    }
  };

  const verifyTwoFactor = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (otpCode === '123456') { // Simulated correct code
        setTwoFactorEnabled(true);
        setSetupStep(3);
        toast.success('Two-factor authentication enabled successfully');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error('Failed to verify 2FA');
    }
  };

  const disableTwoFactor = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTwoFactorEnabled(false);
      setSetupStep(1);
      toast.success('Two-factor authentication disabled successfully');
    } catch (error) {
      toast.error('Failed to disable 2FA');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Profile</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'twoFactor'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            onClick={() => setActiveTab('twoFactor')}
          >
            Two-Factor Authentication
          </button>
        </nav>
      </div>

      {/* Profile Information */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium">Profile Information</h3>
            {!isEditing ? (
              <button
                type="button"
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                onClick={() => {
                  setIsEditing(false);
                  resetProfile();
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative rounded-md">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        className={`pl-10 w-full px-3 py-2 border rounded-md ${errorsProfile.firstName ? 'border-red-500' : 'border-gray-300'}`}
                        {...registerProfile('firstName')}
                      />
                    </div>
                    {errorsProfile.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errorsProfile.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative rounded-md">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="lastName"
                        className={`pl-10 w-full px-3 py-2 border rounded-md ${errorsProfile.lastName ? 'border-red-500' : 'border-gray-300'}`}
                        {...registerProfile('lastName')}
                      />
                    </div>
                    {errorsProfile.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errorsProfile.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      {...registerProfile('email')}
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    To change your email address, please contact support.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">First Name</h4>
                    <p className="mt-1">{user?.name?.split(' ')[0] || 'First'}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
                    <p className="mt-1">{user?.name?.split(' ')[1] || 'Last'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                  <p className="mt-1">{user?.email || 'user@example.com'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Account Status</h4>
                  <p className="mt-1 inline-flex items-center text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Active
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                  <p className="mt-1">January 1, 2023</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Security Settings</h3>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    className={`pl-10 w-full px-3 py-2 border rounded-md ${errorsPassword.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                    {...registerPassword('currentPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errorsPassword.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorsPassword.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    className={`pl-10 w-full px-3 py-2 border rounded-md ${errorsPassword.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                    {...registerPassword('newPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errorsPassword.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorsPassword.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`pl-10 w-full px-3 py-2 border rounded-md ${errorsPassword.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    {...registerPassword('confirmPassword')}
                  />
                </div>
                {errorsPassword.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errorsPassword.confirmPassword.message}</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Minimum 6 characters
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Include at least one special character
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Include at least one number
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Include both uppercase and lowercase letters
                  </li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication */}
      {activeTab === 'twoFactor' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          </div>

          <div className="p-6">
            {twoFactorEnabled ? (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-green-800 font-medium">Two-factor authentication is enabled</h4>
                      <p className="text-green-700 text-sm mt-1">
                        Your account is secured with an additional layer of protection.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-6">
                  <h4 className="font-medium mb-4">Recovery Codes</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Recovery codes can be used to access your account in case you lose your phone or cannot
                    access your authentication app. Keep these codes in a safe place. Each code can only be
                    used once.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    View Recovery Codes
                  </button>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Disable Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Disabling two-factor authentication will make your account less secure. We recommend
                    keeping it enabled for optimal security.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={disableTwoFactor}
                  >
                    Disable 2FA
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {setupStep === 1 && (
                  <div>
                    <div className="bg-yellow-50 p-4 rounded-md mb-6">
                      <div className="flex">
                        <Shield className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                        <div>
                          <h4 className="text-yellow-800 font-medium">Two-factor authentication is not enabled</h4>
                          <p className="text-yellow-700 text-sm mt-1">
                            Enable two-factor authentication to add an extra layer of security to your account.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium mb-2">What is Two-Factor Authentication?</h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Two-factor authentication (2FA) adds an additional layer of security to your account.
                      When enabled, you'll need to provide both your password and a verification code from an
                      authentication app when signing in.
                    </p>

                    <h4 className="font-medium mb-2">How It Works</h4>
                    <ol className="text-sm text-gray-700 mb-6 space-y-2 list-decimal pl-5">
                      <li>Download an authentication app (like Google Authenticator, Microsoft Authenticator, or Authy)</li>
                      <li>Scan the QR code provided by our system</li>
                      <li>Enter the verification code displayed in your app to complete setup</li>
                    </ol>

                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={setupTwoFactor}
                    >
                      Set Up Two-Factor Authentication
                    </button>
                  </div>
                )}

                {setupStep === 2 && (
                  <div>
                    <h4 className="font-medium mb-4">Step 1: Scan QR Code</h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Scan this QR code with your authentication app (Google Authenticator, Microsoft Authenticator, or Authy).
                    </p>

                    <div className="flex justify-center mb-6">
                      <img src={qrCodeUrl} alt="QR Code" className="border border-gray-200 p-2 rounded-md" />
                    </div>

                    <h4 className="font-medium mb-2">Step 2: Verify Code</h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Enter the verification code shown in your authentication app.
                    </p>

                    <div className="mb-6">
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => setSetupStep(1)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={verifyTwoFactor}
                      >
                        Verify and Activate
                      </button>
                    </div>
                  </div>
                )}

                {setupStep === 3 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Two-Factor Authentication Enabled</h3>
                    <p className="text-gray-700 mb-6">
                      Your account is now protected with an additional layer of security.
                    </p>
                    <div className="bg-yellow-50 p-4 border border-yellow-100 rounded-md text-left mb-6">
                      <h4 className="font-medium text-yellow-800 mb-1">Important: Save Your Recovery Codes</h4>
                      <p className="text-sm text-yellow-700">
                        Make sure to save your recovery codes in a safe place. These codes will allow you to access
                        your account if you lose your device.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => {
                        setSetupStep(1);
                        setActiveTab('security');
                      }}
                    >
                      Continue to Security Settings
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
