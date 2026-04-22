export const JWT_CONSTANTS = {
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'default-access-secret-key-32',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key-32',
  ACCESS_EXPIRY: '15m',
  REFRESH_EXPIRY: '7d',
  ALGORITHM: 'HS256',
};

export const SALT_ROUNDS = 10;

export const VERIFICATION_CODE_EXPIRY_MINUTES = 15;

export const SESSION_EXPIRY_DAYS = 7;

export const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT || '587';
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;