/**
 * Common API response types that can be used across all API endpoints
 */

// Base API response type
export interface ApiResponse<T = any> {
  succeeded: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Pagination
export interface PaginatedResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Health check response
export interface HealthCheckResponse {
  status: string;
  components?: Record<string, { status: string; description?: string }>;
  version?: string;
  timestamp?: string;
}

// Authentication types
export interface AuthTokens {
  token: string;
  refreshToken: string;
  requiresTwoFactor?: boolean;
  tempToken?: string;
  expiresIn?: number;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  isActive: boolean;
  isLocked: boolean;
  isTwoFactorEnabled: boolean;
  emailConfirmed: boolean;
  role: string;
  createdOn: string;
  lastActivity: string;
}

// Email types
export interface Email {
  id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml: boolean;
  status: EmailStatus;
  sentAt: string;
  error?: string;
}

export enum EmailStatus {
  Queued = 0,
  Sent = 1,
  Failed = 2,
}

// OTP types
export interface OTPTransaction {
  transactionId: string;
  identifier: string;
  createdAt: string;
  expiresAt: string;
  isVerified: boolean;
  verifiedAt?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  link?: string;
}

export enum NotificationType {
  Info = 0,
  Success = 1,
  Warning = 2,
  Error = 3,
}
