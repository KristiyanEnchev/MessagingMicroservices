import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query';
import { RootState } from '@/store/index';
import { logoutUser, updateToken } from './authSlice';
import { RefreshTokenRequest } from '@/types/authTypes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/';

export const createBaseQuery = (isAuth = false) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token && isAuth) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');

      return headers;
    },
    credentials: 'include',
  });

  return async (args: FetchArgs, api: BaseQueryApi, extraOptions: any) => {
    const state = api.getState() as RootState;
    const { auth } = state;

    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401 && auth.refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: 'api/identity/refresh-token',
            method: 'POST',
            body: { refreshToken: auth.refreshToken } as RefreshTokenRequest,
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const refreshData = refreshResult.data as any;

          if (refreshData.data?.access_token) {
            api.dispatch(
              updateToken({
                token: refreshData.data.access_token,
                refreshToken: refreshData.data.refresh_token,
                expiresAt: Date.now() + (refreshData.data.expires_in || 3600) * 1000,
              })
            );

            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logoutUser());
          }
        } else {
          api.dispatch(logoutUser());
        }
      } catch (error) {
        api.dispatch(logoutUser());
      }
    }

    return result;
  };
};
