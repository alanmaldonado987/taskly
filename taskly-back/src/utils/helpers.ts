import { SALT_ROUNDS, JWT_CONSTANTS, SESSION_EXPIRY_DAYS } from './constants';
import type { AuthPayload, DeviceInfo } from '../types';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { sub: userId, type: 'access' },
    JWT_CONSTANTS.ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    JWT_CONSTANTS.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyAccessToken = (token: string): AuthPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_CONSTANTS.ACCESS_SECRET) as jwt.JwtPayload;
    return { sub: decoded.sub!, type: decoded.type! };
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): AuthPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_CONSTANTS.REFRESH_SECRET) as jwt.JwtPayload;
    return { sub: decoded.sub!, type: decoded.type! };
  } catch {
    return null;
  }
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getSessionExpiry = (): Date => {
  return addDays(new Date(), SESSION_EXPIRY_DAYS);
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const detectDeviceInfo = (userAgent: string | undefined): DeviceInfo => {
  if (!userAgent) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };

  const isMobile = /mobile|android|iphone|ipod/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent);
  const device = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

  const browser =
    /chrome/i.test(userAgent) ? 'Chrome' :
    /safari/i.test(userAgent) ? 'Safari' :
    /firefox/i.test(userAgent) ? 'Firefox' :
    /edge/i.test(userAgent) ? 'Edge' : 'Unknown';

  const os =
    /windows/i.test(userAgent) ? 'Windows' :
    /mac/i.test(userAgent) ? 'MacOS' :
    /linux/i.test(userAgent) ? 'Linux' :
    /android/i.test(userAgent) ? 'Android' :
    /ios|iphone|ipad/i.test(userAgent) ? 'iOS' : 'Unknown';

  return { device, browser, os };
};