import { configureStore, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import toast from 'react-hot-toast';
import { rootReducer } from './rootReducer';

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

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
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
      rtkQueryErrorLogger
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
