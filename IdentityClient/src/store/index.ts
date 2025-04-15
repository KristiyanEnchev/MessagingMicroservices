import { configureStore, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import toast from 'react-hot-toast';
import { rootReducer } from './rootReducer';

// Import all API services
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

const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { status?: number; data?: { message?: string } };
    if (payload.status !== 401) {
      console.error('API Error:', payload);
      toast.error(payload.data?.message || 'An error occurred');
    }
  }
  return next(action);
};

// Configure store with all middleware and APIs
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // API middlewares
      authApi.middleware,
      identityApi.middleware,
      emailApi.middleware,
      smsApi.middleware,
      notificationApi.middleware,
      otpApi.middleware,
      rolesApi.middleware,
      activityApi.middleware,
      twoFactorAuthApi.middleware,
      dashboardApi.middleware,
      // Custom middleware
      rtkQueryErrorLogger
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create the persistor with more specific configuration
export const persistor = persistStore(store, {
  // Adding a small delay can help ensure proper persistence
  manualPersist: false,
  // Adding these callbacks for debugging persistence issues
  ...(process.env.NODE_ENV !== 'production' ? {
    onBeforeLift: () => console.log('Redux Persist: Before state rehydration'),
    onRehydrate: (state) => console.log('Redux Persist: State rehydrated', state ? 'successfully' : 'with issues')
  } : {})
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;