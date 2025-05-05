import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as jwt_decode from 'jwt-decode';
import { RootState } from '@/store/index';
import { authApi } from './authApi';

interface UserData {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  claims: Record<string, string>;
  requires2fa?: boolean;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
  isLoading: boolean;
}

export interface AuthResponse {
  success?: boolean;
  data?: {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    expires_at: string;
    requires_2fa: boolean;
    userId?: string;
    transactionId?: string;
  };
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: string;
  requires_2fa?: boolean;
  userId?: string;
  transactionId?: string;
  errors?: string[] | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  expiresAt: null,
  isLoading: false,
};

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const userEmail = state.auth.user?.email;

    if (userEmail) {
      try {
        await dispatch(authApi.endpoints.logout.initiate({ email: userEmail })).unwrap();
      } catch (error) {
        console.error('Server logout failed:', error);
      }
    }
    dispatch(authSlice.actions.clearAuth());
  }
);

const parseUserFromToken = (token: string): UserData => {
  if (!token || typeof token !== 'string') {
    console.error('Invalid token provided to parseUserFromToken:', token);
    return {
      id: '',
      userName: 'User',
      email: '',
      roles: [],
      claims: {},
    };
  }

  try {
    const decoded: any = jwt_decode.jwtDecode(token);

    let roles: string[] = [];

    if (Array.isArray(decoded.roles)) {
      roles = decoded.roles;
    } else if (typeof decoded.roles === 'string') {
      roles = [decoded.roles];
    } else if (decoded.role) {
      roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
    } else if (decoded.Role) {
      roles = Array.isArray(decoded.Role) ? decoded.Role : [decoded.Role];
    }

    return {
      id: decoded.sub || decoded.id || decoded.userId || '',
      userName: decoded.name || decoded.username || decoded.preferred_username || 'User',
      email: decoded.email || '',
      roles,
      claims: decoded.claims || {},
    };
  } catch (error) {
    console.error('Error parsing token', error);
    return {
      id: '',
      userName: 'User',
      email: '',
      roles: [],
      claims: {},
    };
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {

      let access_token = '';
      let refresh_token = '';
      let expires_at = '';
      let expires_in = 0;

      if (action.payload.access_token) {
        access_token = action.payload.access_token;
        refresh_token = action.payload.refresh_token || '';
        expires_at = action.payload.expires_at || '';
        expires_in = action.payload.expires_in || 0;
      }
      else if (action.payload.data && action.payload.data.access_token) {
        access_token = action.payload.data.access_token;
        refresh_token = action.payload.data.refresh_token || '';
        expires_at = action.payload.data.expires_at || '';
        expires_in = action.payload.data.expires_in || 0;
      }

      if (!access_token) {
        console.error('No access token in auth response', action.payload);
        return;
      }

      const user = parseUserFromToken(access_token);
      state.user = user;
      state.token = access_token;
      state.refreshToken = refresh_token;
      state.isAuthenticated = true;

      const expiresAtTimestamp = expires_at
        ? new Date(expires_at).getTime()
        : (expires_in ? Date.now() + expires_in * 1000 : Date.now() + 3600 * 1000);

      state.expiresAt = expiresAtTimestamp;
    },

    updateToken: (state, action: PayloadAction<{ token: string; refreshToken?: string; expiresAt?: number }>) => {
      const user = parseUserFromToken(action.payload.token);
      state.user = user;
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.expiresAt) {
        state.expiresAt = action.payload.expiresAt;
      }
    },

    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
      state.isLoading = false;
    },

    restoreAuthState: (state) => {
      if (state.token && !state.isAuthenticated && state.user) {
        state.isAuthenticated = true;
      }

      if (state.expiresAt && state.expiresAt < Date.now()) {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.expiresAt = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { setCredentials, updateToken, updateUser, clearAuth, restoreAuthState } = authSlice.actions;

export { selectCurrentUser, selectToken, selectRefreshToken, selectIsAuthenticated, selectExpiresAt, selectAuthLoading } from '@/store/selectors';

export default authSlice.reducer;
