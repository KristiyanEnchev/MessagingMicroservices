import { createApi } from '@reduxjs/toolkit/query/react';
import { servicesBaseQuery } from '../auth/baseQueryWithReauth';

export interface TemplateData {
  field: string;
  value: string;
}

export interface SendBaseSMSCommand {
  to: string;
  from?: string;
  smsProvider?: string;
  message: string;
  templateData?: TemplateData[];
}

export interface SendTemplateSMSCommand {
  to: string;
  from?: string;
  smsProvider?: string;
  templateName: string;
  templateData?: TemplateData[];
}

export const smsApi = createApi({
  reducerPath: 'smsApi',
  baseQuery: servicesBaseQuery,
  tagTypes: ['SMS'],
  endpoints: (builder) => ({
    sendCustomSms: builder.mutation<any, SendBaseSMSCommand>({
      query: (data) => ({
        url: 'sms/custom',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['SMS']
    }),
    
    sendTemplateSms: builder.mutation<any, SendTemplateSMSCommand>({
      query: (data) => ({
        url: 'sms/template',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['SMS']
    }),
    
    healthCheck: builder.query<any, void>({
      query: () => 'sms/Health'
    }),
    
    getSmsStats: builder.query({
      query: () => 'sms/stats',
      transformResponse: () => ({
        totalSent: 1250,
        delivered: 1180,
        failed: 45,
        pending: 25,
        deliveryRate: 94.4,
        last24Hours: 86,
        last7Days: 312,
        last30Days: 1250
      })
    }),
    
    getSmsMessages: builder.query({
      query: (params) => ({
        url: 'sms/messages',
        params
      }),
      transformResponse: () => ({
        messages: Array(20).fill(0).map((_, i) => ({
          id: `sms-${i}`,
          recipient: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          message: i % 3 === 0 ? 'Your verification code is 123456' : 
                  i % 3 === 1 ? 'Your appointment is confirmed' : 
                  'Your password has been reset',
          status: i % 4 === 0 ? 'delivered' : i % 4 === 1 ? 'failed' : i % 4 === 2 ? 'pending' : 'sent',
          createdAt: new Date(Date.now() - i * 1800000).toISOString()
        }))
      })
    }),
    
    getTemplates: builder.query({
      query: () => 'sms/templates',
      transformResponse: () => ([
        {
          id: '1',
          name: 'Verification Code',
          content: 'Your verification code is {{code}}. It expires in {{expiry}} minutes.',
          variables: ['code', 'expiry']
        },
        {
          id: '2',
          name: 'Appointment Reminder',
          content: 'Reminder: You have an appointment scheduled for {{date}} at {{time}}.',
          variables: ['date', 'time']
        },
        {
          id: '3',
          name: 'Password Reset',
          content: 'Your password has been reset. If you did not request this, please contact support immediately.',
          variables: []
        }
      ])
    }),
    
    getTemplateById: builder.query({
      query: (id) => `sms/templates/${id}`,
      transformResponse: (_, __, id) => {
        const templates = [
          {
            id: '1',
            name: 'Verification Code',
            content: 'Your verification code is {{code}}. It expires in {{expiry}} minutes.',
            variables: ['code', 'expiry']
          },
          {
            id: '2',
            name: 'Appointment Reminder',
            content: 'Reminder: You have an appointment scheduled for {{date}} at {{time}}.',
            variables: ['date', 'time']
          },
          {
            id: '3',
            name: 'Password Reset',
            content: 'Your password has been reset. If you did not request this, please contact support immediately.',
            variables: []
          }
        ];
        
        return templates.find(t => t.id === id) || null;
      }
    })
  })
});

export const {
  useSendCustomSmsMutation,
  useSendTemplateSmsMutation,
  useGetSmsStatsQuery,
  useGetSmsMessagesQuery,
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useHealthCheckQuery
} = smsApi;