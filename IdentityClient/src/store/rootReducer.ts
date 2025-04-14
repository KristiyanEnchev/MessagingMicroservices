import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';

// Domain reducers
import authReducer from '@/services/auth/authSlice';
import themeReducer from '@/services/theme/themeSlice';

// API services
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

// Transform to ensure isAuthenticated is correctly set on rehydration
const authTransform = createTransform(
  // Transform state on its way to being serialized and persisted
  (inboundState) => {
    return inboundState;
  },
  // Transform state being rehydrated
  (outboundState) => {
    // Ensure isAuthenticated is true if we have a token and user
    const isAuthenticated = !!(outboundState.token && outboundState.user);
    
    // Check token expiration
    let isExpired = false;
    if (outboundState.expiresAt) {
      isExpired = new Date(outboundState.expiresAt).getTime() < Date.now();
    }
    
    // Only authenticate if token is valid and not expired
    return { 
      ...outboundState, 
      isAuthenticated: isAuthenticated && !isExpired
    };
  },
  { whitelist: ['auth'] }
);

// Persistence configurations for local state
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'refreshToken', 'expiresAt', 'isAuthenticated'],
  version: 1,
  debug: process.env.NODE_ENV !== 'production',
  transforms: [authTransform],
  stateReconciler: (inboundState, originalState) => {
    // Force isAuthenticated to be true if we have a token and user
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
  whitelist: ['isDark', 'theme'], // Ensuring all theme properties are persisted
  version: 1,
  debug: process.env.NODE_ENV !== 'production'
};

// Combine domain reducers with API reducers
export const rootReducer = combineReducers({
  // Domain state with persistence
  auth: persistReducer(authPersistConfig, authReducer),
  theme: persistReducer(themePersistConfig, themeReducer),
  
  // API state
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