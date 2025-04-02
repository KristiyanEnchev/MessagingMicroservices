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
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn?: number;
  expiresAt?: number;
  requiresTwoFactor?: boolean;
}

export interface UserData {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  claims: Record<string, string>;
}