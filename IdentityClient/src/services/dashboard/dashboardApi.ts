import { createApi } from '@reduxjs/toolkit/query/react';
import { identityBaseQuery } from '../auth/baseQueryWithReauth';

export interface SystemStatistics {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  emailsSent: number;
  smsSent: number;
  notificationsSent: number;
  otpsGenerated: number;
  activeUserPercentage: number;
  usersByRole: {
    roleName: string;
    userCount: number;
  }[];
  recentActivity: {
    date: string;
    count: number;
  }[];
}

export interface ServiceStatus {
  name: string;
  status: string;
  responseTime: number;
}

export interface SystemStatusResponse {
  data: {
    status: string;
    uptime: string;
    services: ServiceStatus[];
    message?: string;
  };
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: identityBaseQuery,
  tagTypes: ['Statistics', 'Status'],
  endpoints: (builder) => ({
    getSystemStatistics: builder.query<SystemStatistics, void>({
      query: () => 'api/dashboard/statistics',
      providesTags: ['Statistics'],
      transformResponse: () => ({
        totalUsers: 1250,
        activeUsers: 980,
        totalRoles: 8,
        emailsSent: 3450,
        smsSent: 1250,
        notificationsSent: 4200,
        otpsGenerated: 1760,
        activeUserPercentage: 78.4,
        usersByRole: [
          { roleName: 'Admin', userCount: 5 },
          { roleName: 'Manager', userCount: 15 },
          { roleName: 'Support', userCount: 32 },
          { roleName: 'User', userCount: 928 }
        ],
        recentActivity: Array(7).fill(0).map((_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 50) + 20
        }))
      })
    }),

    getSystemStatus: builder.query<SystemStatusResponse, void>({
      query: () => 'api/dashboard/status',
      providesTags: ['Status'],
      transformResponse: () => ({
        data: {
          status: 'Operational',
          uptime: '23 days, 4 hours, 12 minutes',
          services: [
            { name: 'Identity API', status: 'Healthy', responseTime: 42 },
            { name: 'Email Service', status: 'Healthy', responseTime: 137 },
            { name: 'SMS Service', status: 'Healthy', responseTime: 89 },
            { name: 'OTP Service', status: 'Healthy', responseTime: 65 },
            { name: 'Notification Service', status: 'Healthy', responseTime: 76 }
          ]
        }
      })
    })
  })
});

export const {
  useGetSystemStatisticsQuery,
  useGetSystemStatusQuery
} = dashboardApi;
