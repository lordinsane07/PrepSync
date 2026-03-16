import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface AccessTokenPayload {
  userId: string;
  email: string;
}

interface DecodedAccessToken extends AccessTokenPayload {
  iat: number;
  exp: number;
}

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
}

export function generateRefreshToken(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

export function verifyAccessToken(token: string): DecodedAccessToken {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as DecodedAccessToken;
}

export function generateMagicLinkToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email, purpose: 'magic_login' },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' },
  );
}

export function generatePasswordResetToken(userId: string): string {
  return jwt.sign(
    { userId, purpose: 'password_reset' },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '30m' },
  );
}

export function verifySpecialToken(token: string): Record<string, unknown> {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as Record<string, unknown>;
}
