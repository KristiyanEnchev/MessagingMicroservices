import { createApi } from '@reduxjs/toolkit/query/react';
import { identityBaseQuery } from '../auth/baseQueryWithReauth';

export interface UserActivityModel {
  id: string;
  userId: string;
  type: string;
  timestamp: string;
  data: string;
  ipAddress: string;
  userName: string;
  userEmail: string;
}

export interface UserActivityModelListResult {
  success: boolean;
  data: UserActivityModel[];
  errors: string[] | null;
}

export interface UserActivityFilterParams {
  userId?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  take?: number;
}

export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery: identityBaseQuery,
  tagTypes: ['UserActivity'],
  endpoints: (builder) => ({
    getUserActivity: builder.query<UserActivityModelListResult, UserActivityFilterParams | void>({
      query: (params = {}) => ({
        url: 'api/user-activity',
        params
      }),
      providesTags: ['UserActivity']
    }),
    
    getUserActivityById: builder.query<UserActivityModel, string>({
      query: (id) => `api/user-activity/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserActivity', id }]
    }),
    
    getUserActivityByUser: builder.query<UserActivityModelListResult, { userId: string, take?: number }>({
      query: ({ userId, take = 20 }) => ({
        url: `api/user-activity/user/${userId}`,
        params: { take }
      }),
      providesTags: (result, error, arg) => [{ type: 'UserActivity', id: arg.userId }]
    }),
    
    clearUserActivity: builder.mutation<void, string>({
      query: (userId) => ({
        url: `api/user-activity/clear/${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['UserActivity']
    })
  })
});

export const {
  useGetUserActivityQuery,
  useGetUserActivityByIdQuery,
  useGetUserActivityByUserQuery,
  useClearUserActivityMutation
} = activityApi;