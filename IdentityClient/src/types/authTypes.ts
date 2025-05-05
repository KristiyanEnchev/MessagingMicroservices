export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
}

export interface RegisterRequest {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface AuthResponse {
  accessToken?: string;
  tokenType?: string;
  refreshToken?: string;
  expiresIn?: number;
  expiresAt?: string | number;
  requiresTwoFactor?: boolean;
  isAuthenticated?: boolean;
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: string;
  requires_2fa?: boolean;
  
  userId?: string;
  transactionId?: string;
  success?: boolean;
  
  errors?: string[] | null;
  
  user?: UserData;
  
  data?: {
    userId?: string;
    transactionId?: string;
    access_token?: string;
    token_type?: string;
    refresh_token?: string;
    expires_in?: number;
    expires_at?: string;
    requires_2fa?: boolean;
    role?: string;
  };
}

export interface UserData {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  claims: Record<string, string>;
}