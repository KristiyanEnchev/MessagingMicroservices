import { createApi } from '@reduxjs/toolkit/query/react';
import { identityBaseQuery } from './baseQueryWithReauth';

export interface Generate2FACodeCommand {
  userId: string;
}

export interface Verify2FACodeCommand {
  userId: string;
  code: string;
  transactionId: string;
}

export interface TwoFactorCodeResultResult {
  success: boolean;
  data: {
    transactionId: string;
    message: string;
  };
  errors: string[] | null;
}

export interface EnableTwoFactorAuthenticationCommand {
  email: string;
}

export interface DisableTwoFactorAuthenticationCommand {
  email: string;
}

export interface StringResult {
  success: boolean;
  data: string;
  errors: string[] | null;
}

export interface UserResponseModelResult {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    expires_at: string;
    requires_2fa: boolean;
  };
  errors: string[] | null;
}

export const twoFactorAuthApi = createApi({
  reducerPath: 'twoFactorAuthApi',
  baseQuery: identityBaseQuery,
  tagTypes: ['2FA'],
  endpoints: (builder) => ({
    generate2FACode: builder.mutation<TwoFactorCodeResultResult, Generate2FACodeCommand>({
      query: (data) => ({
        url: 'api/twofactorauth/generate',
        method: 'POST',
        body: data
      })
    }),
    
    verify2FACode: builder.mutation<UserResponseModelResult, Verify2FACodeCommand>({
      query: (data) => ({
        url: 'api/twofactorauth/verify',
        method: 'POST',
        body: data
      })
    }),
    
    enable2FA: builder.mutation<StringResult, EnableTwoFactorAuthenticationCommand>({
      query: (data) => ({
        url: 'api/twofactorauth/enable2fa',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['2FA']
    }),
    
    disable2FA: builder.mutation<StringResult, DisableTwoFactorAuthenticationCommand>({
      query: (data) => ({
        url: 'api/twofactorauth/disable2fa',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['2FA']
    })
  })
});

export const {
  useGenerate2FACodeMutation,
  useVerify2FACodeMutation,
  useEnable2FAMutation,
  useDisable2FAMutation
} = twoFactorAuthApi;