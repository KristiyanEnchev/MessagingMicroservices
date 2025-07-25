import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';

import authReducer from '@/services/auth/authSlice';
import themeReducer from '@/services/theme/themeSlice';

import { authApi } from '@/services/auth/authApi';
import { identityApi } from '@/services/identity/identityApi';
import { emailApi } from '@/services/email/emailApi';
import { smsApi } from '@/services/sms/smsApi';
import { notificationApi } from '@/services/notification/notificationApi';
import { otpApi } from '@/services/otp/otpApi';
import { rolesApi } from '@/services/roles/rolesApi';
import { activityApi } from '@/services/activity/activityApi';
import { twoFactorAuthApi } from '@/services/auth/twoFactorAuthApi';
import { dashboardApi } from '@/services/dashboard/dashboardApi';
import { AuthState } from '@/services/auth/authSlice';

const authTransform = createTransform<AuthState, AuthState>(
  (inboundState) => inboundState,
  (outboundState) => {
    const isAuthenticated = !!(outboundState.token && outboundState.user);

    let isExpired = false;
    if (outboundState.expiresAt) {
      isExpired = new Date(outboundState.expiresAt).getTime() < Date.now();
    }

    return {
      ...outboundState,
      isAuthenticated: isAuthenticated && !isExpired
    };
  },
  { whitelist: ['auth'] }
);

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'refreshToken', 'expiresAt', 'isAuthenticated'],
  version: 1,
  debug: process.env.NODE_ENV !== 'production',
  transforms: [authTransform],
  stateReconciler: (inboundState: AuthState, originalState: AuthState) => {
    const enhancedInbound = {
      ...inboundState,
      isAuthenticated: !!(inboundState.token && inboundState.user)
    };
    return { ...originalState, ...enhancedInbound };
  }
};

const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['isDark', 'theme'],
  version: 1,
  debug: process.env.NODE_ENV !== 'production'
};

export const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  theme: persistReducer(themePersistConfig, themeReducer),

  [authApi.reducerPath]: authApi.reducer,
  [identityApi.reducerPath]: identityApi.reducer,
  [emailApi.reducerPath]: emailApi.reducer,
  [smsApi.reducerPath]: smsApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [otpApi.reducerPath]: otpApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [activityApi.reducerPath]: activityApi.reducer,
  [twoFactorAuthApi.reducerPath]: twoFactorAuthApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
});
