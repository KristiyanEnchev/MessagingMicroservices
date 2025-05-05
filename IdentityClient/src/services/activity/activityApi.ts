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
  length?: number;
  map?: <T>(callback: (value: UserActivityModel, index: number) => T) => T[];
  find?: (predicate: (value: UserActivityModel) => boolean) => UserActivityModel | undefined;
  filter?: (predicate: (value: UserActivityModel) => boolean) => UserActivityModel[];
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
      query: (params?: UserActivityFilterParams) => ({
        url: 'api/user-activity',
        params: params ?? undefined
      }),
      providesTags: ['UserActivity']
    }),

    getUserActivityById: builder.query<UserActivityModel, string>({
      query: (id) => `api/user-activity/${id}`,
      providesTags: (_, __, id) => [{ type: 'UserActivity', id }]
    }),

    getUserActivityByUser: builder.query<UserActivityModelListResult, { userId: string, take?: number }>({
      query: ({ userId, take = 20 }) => ({
        url: `api/user-activity/user/${userId}`,
        params: { take }
      }),
      providesTags: (_, __, arg) => [{ type: 'UserActivity', id: arg.userId }]
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