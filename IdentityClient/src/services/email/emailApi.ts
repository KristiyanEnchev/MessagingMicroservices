import { createApi } from '@reduxjs/toolkit/query/react';
import { servicesBaseQuery } from '../auth/baseQueryWithReauth';

export interface TemplateData {
  field: string;
  value: string;
}

export interface FileAttachmentModel {
  name: string;
  contentBytes: string;
}

export interface SendBaseEmailCommand {
  from?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  displayName?: string;
  replyTo?: string;
  replyToName?: string;
  templateData?: TemplateData[];
  attachmentFiles?: FileAttachmentModel[];
  headers?: Record<string, string>;
  emailProvider: string;
  body: string;
}

export interface SendTemplateEmailCommand {
  from?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  // displayName?: string;
  // replyTo?: string;
  // replyToName?: string;
  templateData?: TemplateData[];
  // attachmentFiles?: FileAttachmentModel[];
  // headers?: Record<string, string>;
  emailProvider: string;
  // templateKey: string;
}

export const emailApi = createApi({
  reducerPath: 'emailApi',
  baseQuery: servicesBaseQuery,
  tagTypes: ['Email'],
  endpoints: (builder) => ({
    sendCustomEmail: builder.mutation<any, SendBaseEmailCommand>({
      query: (data) => ({
        url: 'email/custom',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Email']
    }),

    sendTemplateEmail: builder.mutation<any, SendTemplateEmailCommand>({
      query: (data) => ({
        url: 'email/template',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Email']
    }),

    healthCheck: builder.query<any, void>({
      query: () => 'email/Health'
    }),

    getEmailStats: builder.query({
      query: () => 'email/stats',
      transformResponse: () => ({
        totalSent: 2560,
        delivered: 2480,
        bounced: 55,
        pending: 25,
        opened: 1820,
        clicked: 735,
        deliveryRate: 96.8,
        openRate: 73.4,
        clickRate: 28.7,
        last24Hours: 124,
        last7Days: 864,
        last30Days: 2560
      })
    }),

    getEmailHistory: builder.query({
      query: (params) => ({
        url: 'email/history',
        params
      }),
      transformResponse: () => (
        Array(20).fill(0).map((_, i) => ({
          id: `email-${i}`,
          to: [`recipient${i}@example.com`],
          cc: i % 3 === 0 ? [`cc${i}@example.com`] : [],
          bcc: i % 4 === 0 ? [`bcc${i}@example.com`] : [],
          subject: i % 3 === 0 ? 'Your Account Verification' :
            i % 3 === 1 ? 'Monthly Statement Available' :
              'Password Reset Requested',
          status: i % 5 === 0 ? 'bounced' : i % 5 === 1 ? 'pending' : 'delivered',
          openedAt: i % 5 > 1 ? new Date(Date.now() - i * 60000).toISOString() : null,
          clickedAt: i % 5 > 2 ? new Date(Date.now() - i * 30000).toISOString() : null,
          createdAt: new Date(Date.now() - i * 300000).toISOString()
        }))
      )
    }),

    getTemplates: builder.query({
      query: () => 'email/templates',
      transformResponse: () => ([
        {
          id: '1',
          name: 'Account Verification',
          subject: 'Verify Your Account',
          preview: 'Account verification email with verification code',
          variables: ['name', 'verificationCode']
        },
        {
          id: '2',
          name: 'Password Reset',
          subject: 'Reset Your Password',
          preview: 'Password reset email with reset link',
          variables: ['name', 'resetUrl']
        },
        {
          id: '3',
          name: 'Welcome Email',
          subject: 'Welcome to Our Platform',
          preview: 'Welcome email for new users',
          variables: ['name', 'docsUrl', 'supportUrl', 'blogUrl']
        }
      ])
    }),

    getTemplateById: builder.query({
      query: (id) => `email/templates/${id}`,
      transformResponse: (_, __, id) => {
        const templates = [
          {
            id: '1',
            name: 'Account Verification',
            subject: 'Verify Your Account',
            body: '<div style="font-family: Arial, sans-serif;"><h2>Verify Your Account</h2><p>Hello {{name}},</p><p>Thank you for signing up! Please use the following verification code to complete your registration:</p><div style="text-align: center; font-size: 24px; padding: 15px; background-color: #f2f2f2; margin: 20px auto; max-width: 300px; border-radius: 5px;"><strong>{{verificationCode}}</strong></div><p>This code will expire in 10 minutes.</p><p>Regards,<br>The Team</p></div>',
            variables: ['name', 'verificationCode']
          },
          {
            id: '2',
            name: 'Password Reset',
            subject: 'Reset Your Password',
            body: '<div style="font-family: Arial, sans-serif;"><h2>Password Reset</h2><p>Hello {{name}},</p><p>You requested to reset your password. Please click the button below to set a new password:</p><p><a href="{{resetUrl}}" style="background-color: #2196F3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a></p><p>If you did not request a password reset, please ignore this email or contact support.</p><p>Regards,<br>The Team</p></div>',
            variables: ['name', 'resetUrl']
          },
          {
            id: '3',
            name: 'Welcome Email',
            subject: 'Welcome to Our Platform',
            body: '<div style="font-family: Arial, sans-serif;"><h2>Welcome to Our Platform</h2><p>Hello {{name}},</p><p>Thank you for joining our platform. We\'re excited to have you on board!</p><p>Here are some resources to help you get started:</p><ul><li><a href="{{docsUrl}}">Documentation</a></li><li><a href="{{supportUrl}}">Support</a></li><li><a href="{{blogUrl}}">Blog</a></li></ul><p>If you have any questions, please don\'t hesitate to contact us.</p><p>Regards,<br>The Team</p></div>',
            variables: ['name', 'docsUrl', 'supportUrl', 'blogUrl']
          }
        ];

        return templates.find(t => t.id === id) || null;
      }
    })
  })
});

export const {
  useSendCustomEmailMutation,
  useSendTemplateEmailMutation,
  useHealthCheckQuery,
  useGetEmailStatsQuery,
  useGetEmailHistoryQuery,
  useGetTemplatesQuery,
  useGetTemplateByIdQuery
} = emailApi;
