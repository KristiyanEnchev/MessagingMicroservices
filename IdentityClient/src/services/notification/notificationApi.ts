import { createApi } from '@reduxjs/toolkit/query/react';
import { servicesBaseQuery } from '../auth/baseQueryWithReauth';

export enum StrategyType {
  Push = 'Push',
  Scheduled = 'Scheduled'
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export enum Status {
  Information = 'Information',
  Warning = 'Warning',
  Success = 'Success',
  Error = 'Error'
}

export interface SendNotificationCommand {
  clientId?: string;
  type: StrategyType;
  priority: Priority;
  message?: string;
  targetAudiences?: string[];
  label: Status;
  activate: boolean;
  startDate: string;
  endDate: string;
  targetArea?: string;
}

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: servicesBaseQuery,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    sendNotification: builder.mutation<any, SendNotificationCommand>({
      query: (data) => ({
        url: 'notification',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Notification']
    }),
    
    healthCheck: builder.query<any, void>({
      query: () => 'notification/Health'
    }),
    
    getNotificationStats: builder.query({
      query: () => 'notification/stats',
      transformResponse: () => ({
        totalSent: 3250,
        active: 125,
        inactive: 3125,
        highPriority: 480,
        mediumPriority: 1840,
        lowPriority: 930,
        pushType: 1450,
        scheduledType: 1800,
        last24Hours: 186,
        last7Days: 1125,
        last30Days: 3250
      })
    }),
    
    getNotificationHistory: builder.query({
      query: (params) => ({
        url: 'notification/history',
        params
      }),
      transformResponse: () => (
        Array(20).fill(0).map((_, i) => ({
          id: `notif-${i}`,
          message: i % 3 === 0 ? 'System maintenance scheduled for tonight at 11 PM UTC' : 
                  i % 3 === 1 ? 'New feature release: Check out our improved dashboard' : 
                  'Your subscription will expire in 3 days',
          type: i % 2 === 0 ? StrategyType.Push : StrategyType.Scheduled,
          priority: i % 3 === 0 ? Priority.High : i % 3 === 1 ? Priority.Medium : Priority.Low,
          status: i % 4 === 0 ? Status.Information : i % 4 === 1 ? Status.Warning : i % 4 === 2 ? Status.Success : Status.Error,
          active: i % 5 !== 0,
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          startDate: new Date(Date.now() - i * 86400000).toISOString(),
          endDate: new Date(Date.now() + (30 - i) * 86400000).toISOString(),
          targetAudiences: i % 3 === 0 ? ['all'] : i % 3 === 1 ? ['admin', 'manager'] : ['user'],
          targetArea: i % 4 === 0 ? 'global' : i % 4 === 1 ? 'dashboard' : i % 4 === 2 ? 'settings' : 'profile'
        }))
      )
    })
  })
});

export const {
  useSendNotificationMutation,
  useHealthCheckQuery,
  useGetNotificationStatsQuery,
  useGetNotificationHistoryQuery
} = notificationApi;