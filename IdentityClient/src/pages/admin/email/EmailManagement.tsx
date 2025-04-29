import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import {
  Send,
  FileText,
  Plus,
  X,
  Check,
  Mail,
  AlertCircle,
  CheckCircle,
  ClockIcon
} from 'lucide-react';

import { useSendCustomEmailMutation, useSendTemplateEmailMutation } from '@/services/email/emailApi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Form validation schema for custom email
const customEmailSchema = z.object({
  to: z.string().min(1, 'At least one recipient is required'),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  emailProvider: z.string().default('smtp'),
  // isHtml: z.boolean().default(true),
});

type CustomEmailFormValues = z.infer<typeof customEmailSchema>;

// Form validation schema for template email
const templateEmailSchema = z.object({
  to: z.string().min(1, 'At least one recipient is required'),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  templateName: z.string().min(1, 'Template name is required'),
  templateData: z.record(z.string()),
});

type TemplateEmailFormValues = {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  templateName: string;
  templateData: Record<string, string>;
};

// Mock email data - this would typically come from your backend
const mockEmails = [
  {
    id: '1',
    to: ['user1@example.com'],
    subject: 'Welcome to our platform',
    sentAt: new Date().toISOString(),
    status: 'sent',
  },
  {
    id: '2',
    to: ['user2@example.com'],
    subject: 'Password reset request',
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
  },
  {
    id: '3',
    to: ['user3@example.com'],
    subject: 'Account verification',
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'failed',
    error: 'Invalid email address',
  },
];

// Mock templates
const mockTemplates = [
  {
    id: '1',
    name: 'email-confirmation',
    description: 'Sent to new users upon registration',
    variables: ['username', 'email', 'url'],
  },
  {
    id: '2',
    name: 'passwordReset',
    description: 'Sent when a user requests a password reset',
    variables: ['username', 'url'],
  },
  {
    id: '3',
    name: 'Account Verification',
    description: 'Sent to verify new email addresses',
    variables: ['firstName', 'verificationCode'],
  },
];

const EmailManagement = () => {
  const [activeTab, setActiveTab] = useState<'custom' | 'template' | 'history'>('custom');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateFields, setTemplateFields] = useState<Record<string, string>>({});
  const [sendCustomEmail, { isLoading: isSendingCustom }] = useSendCustomEmailMutation();
  const [sendTemplateEmail, { isLoading: isSendingTemplate }] = useSendTemplateEmailMutation();

  // Custom email form
  const { register: registerCustom, handleSubmit: handleSubmitCustom, formState: { errors: errorsCustom }, reset: resetCustom } = useForm<CustomEmailFormValues>({
    resolver: zodResolver(customEmailSchema),
    defaultValues: {
      isHtml: true,
    }
  });

  // Template email form
  const { register: registerTemplate, handleSubmit: handleSubmitTemplate, formState: { errors: errorsTemplate }, reset: resetTemplate, setValue } = useForm<TemplateEmailFormValues>({
    resolver: zodResolver(templateEmailSchema),
    defaultValues: {
      templateData: {},
    }
  });

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = mockTemplates.find(t => t.id === templateId);

    if (template) {
      setValue('templateName', template.name);

      // Initialize fields with empty strings
      const initialFields: Record<string, string> = {};
      template.variables.forEach(v => {
        initialFields[v] = '';
      });

      setTemplateFields(initialFields);
    }
  };

  // Handle template field change
  const handleTemplateFieldChange = (field: string, value: string) => {
    setTemplateFields(prev => ({
      ...prev,
      [field]: value,
    }));

    setValue('templateData', {
      ...templateFields,
      [field]: value,
    });
  };

  // Submit custom email
  const onSubmitCustom = async (data: CustomEmailFormValues) => {
    try {
      // Convert comma-separated emails to arrays as required by the API
      const toArray = data.to.split(',').map(email => email.trim()).filter(Boolean);
      const ccArray = data.cc ? data.cc.split(',').map(email => email.trim()).filter(Boolean) : [];
      const bccArray = data.bcc ? data.bcc.split(',').map(email => email.trim()).filter(Boolean) : [];

      await sendCustomEmail({
        ...data,
        to: toArray,
        cc: ccArray,
        bcc: bccArray,
        emailProvider: data.emailProvider || 'smtp'
      }).unwrap();

      toast.success('Email sent successfully');
      resetCustom();
    } catch (error) {
      toast.error('Failed to send email');
      console.error(error);
    }
  };

  // Submit template email
  const onSubmitTemplate = async (data: TemplateEmailFormValues) => {
    try {
      // Convert comma-separated emails to arrays as required by the API
      const toArray = data.to.split(',').map(email => email.trim()).filter(Boolean);
      const ccArray = data.cc ? data.cc.split(',').map(email => email.trim()).filter(Boolean) : [];
      const bccArray = data.bcc ? data.bcc.split(',').map(email => email.trim()).filter(Boolean) : [];

      // Convert template fields to required format
      const templateDataArray = Object.entries(templateFields).map(([field, value]) => ({
        field,
        value
      }));

      await sendTemplateEmail({
        ...data,
        to: toArray,
        cc: ccArray,
        bcc: bccArray,
        templateKey: data.templateName,
        templateData: templateDataArray,
        emailProvider: 'smtp'
      }).unwrap();

      toast.success('Email sent successfully');
      resetTemplate();
      setSelectedTemplate(null);
      setTemplateFields({});
    } catch (error) {
      toast.error('Failed to send email');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Management</h1>
      </div>

      <Card>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'custom'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              Custom Email
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'template'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              Template Email
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'history'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              Email History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'custom' && (
            <form onSubmit={handleSubmitCustom(onSubmitCustom)} className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="col-span-3">
                  <Input
                    label="To"
                    type="text"
                    placeholder="recipient@example.com"
                    id="custom-to"
                    {...registerCustom('to')}
                    error={errorsCustom.to?.message}
                    leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Input
                    label="CC"
                    type="text"
                    placeholder="cc@example.com"
                    id="custom-cc"
                    {...registerCustom('cc')}
                    error={errorsCustom.cc?.message}
                  />
                </div>
                <div>
                  <Input
                    label="BCC"
                    type="text"
                    placeholder="bcc@example.com"
                    id="custom-bcc"
                    {...registerCustom('bcc')}
                    error={errorsCustom.bcc?.message}
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Subject"
                  type="text"
                  placeholder="Email subject"
                  id="custom-subject"
                  {...registerCustom('subject')}
                  error={errorsCustom.subject?.message}
                />
              </div>

              <div>
                <label htmlFor="custom-body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Body
                </label>
                <textarea
                  id="custom-body"
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Email content"
                  {...registerCustom('body')}
                ></textarea>
                {errorsCustom.body && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errorsCustom.body.message}</p>
                )}
              </div>

              {/* <div className="flex items-center">
                <input
                  id="custom-is-html"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...registerCustom('isHtml')}
                />
                <label htmlFor="custom-is-html" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Send as HTML
                </label>
              </div> */}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="default"
                  isLoading={isSendingCustom}
                  className="flex items-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Email
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'template' && (
            <>
              {!selectedTemplate ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{template.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Variables</h4>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {template.variables.map((variable) => (
                            <span key={variable} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {variable}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmitTemplate(onSubmitTemplate)} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {mockTemplates.find(t => t.id === selectedTemplate)?.name}
                    </h3>
                    <Button
                      onClick={() => {
                        setSelectedTemplate(null);
                        setTemplateFields({});
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      Back to Templates
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-3">
                      <Input
                        label="To"
                        type="text"
                        placeholder="recipient@example.com"
                        id="template-to"
                        {...registerTemplate('to')}
                        error={errorsTemplate.to?.message}
                        leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <Input
                        label="CC"
                        type="text"
                        placeholder="cc@example.com"
                        id="template-cc"
                        {...registerTemplate('cc')}
                        error={errorsTemplate.cc?.message}
                      />
                    </div>
                    <div>
                      <Input
                        label="BCC"
                        type="text"
                        placeholder="bcc@example.com"
                        id="template-bcc"
                        {...registerTemplate('bcc')}
                        error={errorsTemplate.bcc?.message}
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Subject"
                      type="text"
                      placeholder="Email subject"
                      id="template-subject"
                      {...registerTemplate('subject')}
                      error={errorsTemplate.subject?.message}
                    />
                  </div>

                  <div>
                    <input
                      type="hidden"
                      id="template-name"
                      {...registerTemplate('templateName')}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Template Variables</h4>
                    {Object.keys(templateFields).map((field) => (
                      <div key={field}>
                        <Input
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          type="text"
                          placeholder={`Enter ${field}`}
                          id={`template-var-${field}`}
                          value={templateFields[field]}
                          onChange={(e) => handleTemplateFieldChange(field, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="default"
                      isLoading={isSendingTemplate}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-5 w-5" />
                      Send Template Email
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">
                          {email.to.map((recipient, index) => (
                            <span key={recipient}>
                              {recipient}
                              {index < email.to.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">{email.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(email.sentAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {email.status === 'sent' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </Button>
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

export default EmailManagement;
