import userRepository from '../repositories/user.repository.js';
import refreshTokenRepository from '../repositories/refreshToken.repository.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../utils/token.util.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/ApiError.js';
import logger from '../config/logger.config.js';

class AuthService {
  async registerUser(userData, ipAddress) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    const user = await userRepository.create(userData);

    const accessToken = generateAccessToken(user);
    const refreshTokenString = generateRefreshToken(user);

    // Save refresh token to DB
    await refreshTokenRepository.create({
      token: refreshTokenString,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdByIp: ipAddress,
    });

    // Don't return the hashed password
    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject, accessToken, refreshToken: refreshTokenString };
  }

  async loginUser(email, password, ipAddress) {
    // Need to explicitly select password because it's excluded by default in the schema
    const user = await userRepository.findByEmail(email);
    
    // In a real scenario we'd use the repository, but because of `select: false` on password, 
    // we need to manually query or add a method to the repo. Let's do it cleanly:
    const userWithPassword = await userRepository.findByEmail(email).select('+password');

    if (!userWithPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await userWithPassword.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (userWithPassword.status !== 'active') {
      throw new UnauthorizedError('Account is not active. Please contact support.');
    }

    // Update login stats
    userWithPassword.lastLogin = new Date();
    userWithPassword.loginCount += 1;
    await userWithPassword.save();

    const accessToken = generateAccessToken(userWithPassword);
    const refreshTokenString = generateRefreshToken(userWithPassword);

    await refreshTokenRepository.create({
      token: refreshTokenString,
      user: userWithPassword._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdByIp: ipAddress,
    });

    const userObject = userWithPassword.toObject();
    delete userObject.password;

    return { user: userObject, accessToken, refreshToken: refreshTokenString };
  }

  async logoutUser(refreshToken, ipAddress) {
    if (refreshToken) {
      await refreshTokenRepository.revoke(refreshToken, ipAddress);
    }
    return true;
  }

  async refreshToken(oldRefreshTokenString, ipAddress) {
    try {
      // 1. Verify JWT signature and expiration
      const payload = verifyRefreshToken(oldRefreshTokenString);
      
      // 2. Find token in DB
      const refreshTokenDoc = await refreshTokenRepository.findByToken(oldRefreshTokenString);
      
      if (!refreshTokenDoc) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // 3. Detect Token Reuse (Security feature)
      if (refreshTokenDoc.revoked) {
        logger.warn(`Token reuse detected for user ${refreshTokenDoc.user._id}. Revoking all tokens.`);
        // If a revoked token is used, compromise is likely. Revoke ALL tokens for this user.
        await refreshTokenRepository.revokeAllForUser(refreshTokenDoc.user._id);
        throw new UnauthorizedError('Token reuse detected. Please login again.');
      }

      if (refreshTokenDoc.isExpired) {
        throw new UnauthorizedError('Refresh token expired');
      }

      // 4. Get User
      const user = refreshTokenDoc.user;
      if (!user || user.status !== 'active') {
        throw new UnauthorizedError('User account is inactive or not found');
      }

      // 5. Generate new tokens
      const newAccessToken = generateAccessToken(user);
      const newRefreshTokenString = generateRefreshToken(user);

      // 6. Rotate tokens: Revoke old, save new
      await refreshTokenRepository.revoke(oldRefreshTokenString, ipAddress, newRefreshTokenString);
      
      await refreshTokenRepository.create({
        token: newRefreshTokenString,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshTokenString };
    } catch (error) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }
      throw error;
    }
  }
}

export default new AuthService();
