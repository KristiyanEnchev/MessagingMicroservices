import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

export const selectCurrentUser = createSelector(
  (state: RootState) => state.auth.user,
  user => user
);

export const selectToken = createSelector(
  (state: RootState) => state.auth.token,
  token => token
);

export const selectRefreshToken = createSelector(
  (state: RootState) => state.auth.refreshToken,
  refreshToken => refreshToken
);

export const selectIsAuthenticated = createSelector(
  (state: RootState) => state.auth.isAuthenticated,
  isAuthenticated => isAuthenticated
);

export const selectExpiresAt = createSelector(
  (state: RootState) => state.auth.expiresAt,
  expiresAt => expiresAt
);

export const selectAuthLoading = createSelector(
  (state: RootState) => state.auth.isLoading,
  isLoading => isLoading
);

export const selectIsDarkTheme = createSelector(
  (state: RootState) => state.theme.isDark,
  isDark => isDark
);
