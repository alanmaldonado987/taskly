export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isActive: boolean;
  avatar: string | null;
  locale: string;
  timezone: string;
  theme: Theme;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  tokenType: SessionType;
  userAgent: string | null;
  ipAddress: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  isRevoked: boolean;
  expiresAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
}

export interface VerificationCode {
  id: string;
  userId: string;
  code: string;
  type: VerificationType;
  isUsed: boolean;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export enum SessionType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export enum VerificationType {
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export interface AuthPayload {
  sub: string;
  type: string;
}

export interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
}