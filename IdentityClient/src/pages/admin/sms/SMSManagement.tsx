import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  RefreshCw,
  ArrowUpDown,
  MoreHorizontal,
  Check,
  Trash,
  Clock,
  Send,
  Filter,
  Phone
} from 'lucide-react';
import { useGetSmsMessagesQuery, useSendCustomSmsMutation } from '@/services/sms/smsApi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const SMSManagement = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'send'>('logs');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const {
    data: smsData,
    isLoading,
    isFetching,
    refetch
  } = useGetSmsMessagesQuery({
    limit,
    offset,
    status: statusFilter
  });

  const [sendSms, sendSmsResult] = useSendCustomSmsMutation();

  const smsMessages = smsData?.data?.messages || [
    {
      id: '1',
      recipient: '+1234567890',
      message: 'Your verification code is 123456',
      status: 'delivered',
      sentAt: '2023-08-15T14:30:00',
      deliveredAt: '2023-08-15T14:30:05',
    },
    {
      id: '2',
      recipient: '+1987654321',
      message: 'Your account has been updated. Please log in to verify the changes.',
      status: 'failed',
      sentAt: '2023-08-15T15:00:00',
      error: 'Invalid phone number',
    },
    {
      id: '3',
      recipient: '+1122334455',
      message: 'Your appointment is scheduled for tomorrow at 10:00 AM',
      status: 'pending',
      sentAt: '2023-08-15T16:15:00',
    },
    {
      id: '4',
      recipient: '+1555666777',
      message: 'Your password reset code is 654321',
      status: 'delivered',
      sentAt: '2023-08-15T17:20:00',
      deliveredAt: '2023-08-15T17:20:03',
    },
  ];

  const filteredSMSMessages = smsMessages.filter(message => {
    const matchesSearch =
      message.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      message.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSendSMS = async () => {
    if (!recipient || !message) {
      return;
    }

    try {
      await sendSms({
        to: recipient,
        message,
        smsProvider: 'twilio'
      }).unwrap();

      setRecipient('');
      setMessage('');
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SMS Management</h1>
      </div>

      <Card>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'logs'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              SMS Logs
            </button>
            <button
              onClick={() => setActiveTab('send')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'send'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              Send SMS
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="w-full md:w-1/2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Search by recipient or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="delivered">Delivered</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Message
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sent At
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredSMSMessages.map((message) => (
                      <tr key={message.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-300">{message.recipient}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-300 max-w-md truncate">{message.message}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {message.status === 'delivered' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              <Check className="h-3 w-3 mr-1" />
                              Delivered
                            </span>
                          )}
                          {message.status === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </span>
                          )}
                          {message.status === 'failed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              <Trash className="h-3 w-3 mr-1" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(message.sentAt).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredSMSMessages.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                          No SMS messages found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {smsData?.data ? (
                    <>
                      Showing <span className="font-medium">{filteredSMSMessages.length}</span> of <span className="font-medium">{smsData.data.totalCount || smsMessages.length}</span> messages
                    </>
                  ) : (
                    <>Loading message count...</>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offset === 0}
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                  >
                    {Math.floor(offset / limit) + 1}
                  </Button>
                  {smsData?.data?.totalCount && offset + limit < smsData.data.totalCount && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOffset(offset + limit)}
                    >
                      {Math.floor(offset / limit) + 2}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!smsData?.data?.totalCount || offset + limit >= smsData.data.totalCount}
                    onClick={() => setOffset(offset + limit)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'send' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <Input
                  label="Recipient"
                  type="text"
                  placeholder="+1234567890"
                  id="sms-recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  startIcon={<Phone className="h-5 w-5 text-gray-400" />}
                />
              </div>

              <div>
                <label htmlFor="sms-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="sms-message"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {message.length}/160 characters {message.length > 160 ? `(${Math.ceil(message.length / 160)} messages)` : ''}
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  isLoading={sendSmsResult.isLoading}
                  onClick={handleSendSMS}
                  startIcon={<Send className="h-5 w-5" />}
                >
                  Send SMS
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SMSManagement;
