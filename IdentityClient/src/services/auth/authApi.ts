import { createApi } from '@reduxjs/toolkit/query/react';
import { identityBaseQuery } from './baseQueryWithReauth';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  rememberMe: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  email: string;
}

export interface UnlockAccountRequest {
  email: string;
}

export interface AuthResponse {
  refresh_token: string;
  expires_in: number;
  expires_at: string;
  requires_2fa: boolean;
  token_type: string;
  access_token: string;
  success: boolean;
  data: {
    userId: string;
    transactionId: string;
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    expires_at: string;
    requires_2fa: boolean;
  };
  errors: string[] | null;
}

export interface StringResult {
  success: boolean;
  data: string;
  errors: string[] | null;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: identityBaseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'api/identity/login',
        method: 'POST',
        body: credentials,
      })
    }),

    register: builder.mutation<string, RegisterRequest>({
      query: (userData) => ({
        url: 'api/identity/register',
        method: 'POST',
        body: userData,
      })
    }),

    logout: builder.mutation<StringResult, LogoutRequest>({
      query: (data) => ({
        url: 'api/identity/logout',
        method: 'POST',
        body: data,
      })
    }),

    refresh: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (refreshData) => ({
        url: 'api/identity/refresh',
        method: 'POST',
        body: refreshData,
      })
    }),

    cookieLogin: builder.mutation<StringResult, LoginRequest>({
      query: (credentials) => ({
        url: 'api/cookie/login-with-cookie',
        method: 'POST',
        body: credentials,
      })
    }),

    cookieLogout: builder.mutation<StringResult, void>({
      query: () => ({
        url: 'api/cookie/logout-cookie',
        method: 'POST',
      })
    }),

    unlockAccount: builder.mutation<StringResult, UnlockAccountRequest>({
      query: (data) => ({
        url: 'api/identity/unlock',
        method: 'POST',
        body: data,
      })
    }),

    forgotPassword: builder.mutation<StringResult, { email: string, resetPasswordUrl: string }>({
      query: (data) => ({
        url: 'api/password/forgot-password',
        method: 'POST',
        body: data,
      })
    }),

    resetPassword: builder.mutation<StringResult, { email: string, token: string, newPassword: string, confirmPassword: string }>({
      query: (data) => ({
        url: 'api/password/reset-password',
        method: 'POST',
        body: data,
      })
    }),

    changePassword: builder.mutation<StringResult, { email: string, currentPassword: string, newPassword: string, confirmPassword: string }>({
      query: (data) => ({
        url: 'api/password/change-password',
        method: 'POST',
        body: data,
      })
    }),

    resendVerificationEmail: builder.mutation<StringResult, { email: string, origin: string }>({
      query: (data) => ({
        url: 'api/email/resend',
        method: 'POST',
        body: data,
      })
    }),

    confirmEmail: builder.query<StringResult, { email: string, token: string, otp: string }>({
      query: (params) => ({
        url: 'api/email/confirm',
        params
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
  useCookieLoginMutation,
  useCookieLogoutMutation,
  useUnlockAccountMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useResendVerificationEmailMutation,
  useConfirmEmailQuery
} = authApi;
