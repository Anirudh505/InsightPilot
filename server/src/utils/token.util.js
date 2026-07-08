import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';

/**
 * Generate Access Token (Short-lived)
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

/**
 * Generate Refresh Token (Long-lived)
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
};

/**
 * Standardized Cookie Options for Refresh Tokens
 */
export const getRefreshTokenCookieOptions = () => {
  // Convert '7d' string (if used) to milliseconds for cookie maxAge
  // For simplicity, hardcoding 7 days here as standard
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge,
  };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwtRefreshSecret);
};
