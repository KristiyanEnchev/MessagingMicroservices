import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/index';
import { setCredentials, logoutUser } from './authSlice';
import type { QueryReturnValue } from '@reduxjs/toolkit/query';

export const IDENTITY_API_URL = 'http://localhost:8080/';
export const SERVICES_API_URL = 'http://localhost:5008/';

let isRefreshing = false;
let refreshPromise: Promise<QueryReturnValue<any, any, any>> | QueryReturnValue<any, any, any> | null = null;

export const identityBaseQuery = fetchBaseQuery({
  baseUrl: IDENTITY_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const servicesBaseQuery = fetchBaseQuery({
  baseUrl: SERVICES_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const isIdentityOrAccount = args.url.startsWith('api/identity') || 
                            args.url.startsWith('api/account') || 
                            args.url.startsWith('api/roles') || 
                            args.url.startsWith('api/user-activity') ||
                            args.url.startsWith('api/twofactorauth') ||
                            args.url.startsWith('api/password') ||
                            args.url.startsWith('api/cookie') ||
                            args.url.startsWith('api/email/confirm') ||
                            args.url.startsWith('api/email/resend');
  
  const baseQuery = isIdentityOrAccount ? identityBaseQuery : servicesBaseQuery;
  
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        const refreshToken = (api.getState() as RootState).auth.refreshToken;
        
        if (!refreshToken) {
          api.dispatch(logoutUser());
          return result;
        }
        
        refreshPromise = Promise.resolve(
          identityBaseQuery(
            {
              url: 'api/identity/refresh',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions
          )
        );

        const refreshResult = await refreshPromise;

        if (refreshResult.data && refreshResult.data.success) {
          api.dispatch(setCredentials(refreshResult.data));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logoutUser());
        }
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    } else if (refreshPromise) {
      await refreshPromise;
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};