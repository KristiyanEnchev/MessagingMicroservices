import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import {
  Key,
  CheckCircle,
  XCircle,
  Fingerprint,
  UserCheck,
  User,
  Clock,
  ShieldCheck
} from 'lucide-react';

import { useGenerateOtpMutation, useValidateOtpMutation } from '@/services/otp/otpApi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Form validation schema for generate
const generateOtpSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  expirationMinutes: z.number().int().min(1, 'Expiration must be at least 1 minute').max(60, 'Expiration cannot exceed 60 minutes').default(5),
  digits: z.boolean().default(true),
  size: z.number().int().min(4, 'Size must be at least 4').max(8, 'Size cannot exceed 8').default(6),
});

type GenerateOtpFormValues = z.infer<typeof generateOtpSchema>;

// Verify OTP schema
const verifyOtpSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  otp: z.string().min(4, 'Code must be at least 4 characters').max(8, 'Code cannot exceed 8 characters'),
});

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

// Mock OTP history data
const mockOtpHistory = [
  {
    id: '1',
    identifier: 'user1@example.com',
    transactionId: 'txn123456',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    isVerified: false,
    verifiedAt: null,
  },
  {
    id: '2',
    identifier: 'user2@example.com',
    transactionId: 'txn789012',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isVerified: true,
    verifiedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    identifier: 'user3@example.com',
    transactionId: 'txn345678',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isVerified: false,
    verifiedAt: null,
  },
];

const OTPManagement = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'verify' | 'history'>('generate');
  const [generatedOtp, setGeneratedOtp] = useState<{ otp: string; transactionId: string } | null>(null);
  const [generateOTP, { isLoading: isGenerating }] = useGenerateOtpMutation();
  const [validateOTP, { isLoading: isValidating }] = useValidateOtpMutation();

  // Generate OTP form
  const { register: registerGenerate, handleSubmit: handleSubmitGenerate, formState: { errors: errorsGenerate }, reset: resetGenerate } = useForm<GenerateOtpFormValues>({
    resolver: zodResolver(generateOtpSchema),
    defaultValues: {
      expirationMinutes: 5,
      digits: true,
      size: 6,
    }
  });

  // Verify OTP form
  const { register: registerVerify, handleSubmit: handleSubmitVerify, formState: { errors: errorsVerify }, reset: resetVerify } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
  });

  // Submit generate OTP
  const onSubmitGenerate = async (data: GenerateOtpFormValues) => {
    try {
      // We're mocking this response since we don't have an actual API
      // const result = await generateOTP(data).unwrap();
      const mockOtp = {
        otp: Array.from({ length: data.size }, () => Math.floor(Math.random() * 10)).join(''),
        transactionId: `txn${Math.random().toString(36).substring(2, 10)}`,
      };
      var otpResult = await generateOTP(data).unwrap();
      setGeneratedOtp(otpResult.data);
      toast.success('OTP generated successfully');
    } catch (error) {
      toast.error('Failed to generate OTP');
      console.error(error);
    }
  };

  // Submit verify OTP
  const onSubmitVerify = async (data: VerifyOtpFormValues) => {
    try {
      // We're mocking this response since we don't have an actual API
      // const result = await validateOTP(data).unwrap();
      // const isValid = Math.random() > 0.3; // 70% chance of success for demo purposes
      const isValid = await validateOTP(data).unwrap();
      if (isValid) {
        toast.success('OTP verified successfully');
        resetVerify();
      } else {
        toast.error('Invalid OTP code');
      }
    } catch (error) {
      toast.error('Failed to verify OTP');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">OTP Management</h1>
      </div>
      
      <Card>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'generate'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Generate OTP
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'verify'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Verify OTP
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              OTP History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <form onSubmit={handleSubmitGenerate(onSubmitGenerate)} className="space-y-4">
                <div>
                  <Input
                    label="Identifier (Email or Phone)"
                    type="text"
                    placeholder="user@example.com or +1234567890"
                    id="generate-identifier"
                    {...registerGenerate('identifier')}
                    error={errorsGenerate.identifier?.message}
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="generate-expiration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiration (minutes)
                    </label>
                    <input
                      type="number"
                      id="generate-expiration"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      min="1"
                      max="60"
                      {...registerGenerate('expirationMinutes', { valueAsNumber: true })}
                    />
                    {errorsGenerate.expirationMinutes && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errorsGenerate.expirationMinutes.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="generate-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      OTP Length
                    </label>
                    <input
                      type="number"
                      id="generate-size"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      min="4"
                      max="8"
                      {...registerGenerate('size', { valueAsNumber: true })}
                    />
                    {errorsGenerate.size && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errorsGenerate.size.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="generate-digits"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...registerGenerate('digits')}
                  />
                  <label htmlFor="generate-digits" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Digits only (no letters)
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="default"
                    isLoading={isGenerating}
                    // Icon can be added inside the button component
                  >
                    <Key className="h-5 w-5 mr-2" />
                  Generate OTP
                  </Button>
                </div>
              </form>
              
              {generatedOtp && (
                <div className="mt-6 p-4 border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20 rounded-md">
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-300 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    OTP Generated Successfully
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">OTP Code:</p>
                      <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white mt-1 tracking-wider">
                        {generatedOtp.otp}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID:</p>
                      <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">
                        {generatedOtp.transactionId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'verify' && (
            <form onSubmit={handleSubmitVerify(onSubmitVerify)} className="space-y-4">
              <div>
                <Input
                  label="Identifier (Email or Phone)"
                  type="text"
                  placeholder="user@example.com or +1234567890"
                  id="verify-identifier"
                  {...registerVerify('identifier')}
                  error={errorsVerify.identifier?.message}
                  startIcon={<User className="h-5 w-5 text-gray-400" />}
                />
              </div>
              
              <div>
                <Input
                  label="Transaction ID"
                  type="text"
                  placeholder="Transaction ID"
                  id="verify-transaction-id"
                  {...registerVerify('transactionId')}
                  error={errorsVerify.transactionId?.message}
                  startIcon={<Fingerprint className="h-5 w-5 text-gray-400" />}
                />
              </div>
              
              <div>
                <Input
                  label="OTP Code"
                  type="text"
                  placeholder="Enter OTP code"
                  id="verify-otp"
                  {...registerVerify('otp')}
                  error={errorsVerify.otp?.message}
                  startIcon={<Key className="h-5 w-5 text-gray-400" />}
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="default"
                  isLoading={isValidating}
                >
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Verify OTP
                </Button>
              </div>
            </form>
          )}
          
          {activeTab === 'history' && (
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Identifier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Expires
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockOtpHistory.map((otp) => (
                    <tr key={otp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">{otp.identifier}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900 dark:text-gray-300">{otp.transactionId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(otp.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(otp.expiresAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {otp.isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        ) : new Date(otp.expiresAt) < new Date() ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            <XCircle className="h-3 w-3 mr-1" />
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            <Key className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OTPManagement;