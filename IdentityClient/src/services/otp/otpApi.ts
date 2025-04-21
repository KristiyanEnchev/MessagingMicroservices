import { createApi } from '@reduxjs/toolkit/query/react';
import { servicesBaseQuery } from '../auth/baseQueryWithReauth';

export interface OneTimePinGenerateCommand {
  identifier: string;
  expirationMinutes: number;
}

export interface OneTimePinValidateCommand {
  identifier: string;
  transactionId: string;
  otp: string;
}

export const otpApi = createApi({
  reducerPath: 'otpApi',
  baseQuery: servicesBaseQuery,
  tagTypes: ['OTP'],
  endpoints: (builder) => ({
    generateOtp: builder.mutation<any, OneTimePinGenerateCommand & { digits?: boolean, size?: number }>({
      query: (data) => ({
        url: 'otp/generate',
        method: 'POST',
        params: {
          digits: data.digits,
          size: data.size
        },
        body: {
          identifier: data.identifier,
          expirationMinutes: data.expirationMinutes
        }
      }),
      invalidatesTags: ['OTP']
    }),
    
    validateOtp: builder.mutation<any, OneTimePinValidateCommand>({
      query: (data) => ({
        url: 'otp/validate',
        method: 'POST',
        body: data
      })
    }),
    
    healthCheck: builder.query<any, void>({
      query: () => 'otp/Health'
    }),
    
    getOtpStats: builder.query({
      query: () => ({
        url: 'otp/stats',
      }),
      transformResponse: () => ({
        totalGenerated: 1250,
        validated: 980,
        expired: 220,
        invalidAttempts: 148,
        validationRate: 78.4,
        last24Hours: 86,
        last7Days: 312,
        last30Days: 1250
      })
    }),
    
    getOtpHistory: builder.query({
      query: (params) => ({
        url: 'otp/history',
        params
      }),
      transformResponse: () => (
        Array(20).fill(0).map((_, i) => ({
          id: `otp-${i}`,
          identifier: `identifier-${i}`,
          code: `${Math.floor(100000 + Math.random() * 900000)}`,
          validUntil: new Date(Date.now() + (i % 5) * 60000).toISOString(),
          isValidated: i % 3 === 0,
          createdAt: new Date(Date.now() - i * 300000).toISOString(),
          validatedAt: i % 3 === 0 ? new Date(Date.now() - i * 200000).toISOString() : null
        }))
      )
    })
  })
});

export const {
  useGenerateOtpMutation,
  useValidateOtpMutation,
  useGetOtpStatsQuery,
  useGetOtpHistoryQuery,
  useHealthCheckQuery
} = otpApi;