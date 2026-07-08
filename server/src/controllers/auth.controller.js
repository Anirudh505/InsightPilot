import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import authService from '../services/auth.service.js';
import { getRefreshTokenCookieOptions } from '../utils/token.util.js';

class AuthController {
  /**
   * @desc    Register user
   * @route   POST /api/v1/auth/register
   * @access  Public
   */
  register = AsyncHandler(async (req, res) => {
    const ipAddress = req.ip;
    const { user, accessToken, refreshToken } = await authService.registerUser(req.body, ipAddress);

    // Set Refresh Token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

    res.status(201).json(new ApiResponse(201, { user, accessToken }, 'User registered successfully'));
  });

  /**
   * @desc    Login user
   * @route   POST /api/v1/auth/login
   * @access  Public
   */
  login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip;

    const { user, accessToken, refreshToken } = await authService.loginUser(email, password, ipAddress);

    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

    res.status(200).json(new ApiResponse(200, { user, accessToken }, 'Login successful'));
  });

  /**
   * @desc    Logout user
   * @route   POST /api/v1/auth/logout
   * @access  Private
   */
  logout = AsyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const ipAddress = req.ip;

    await authService.logoutUser(refreshToken, ipAddress);

    res.clearCookie('refreshToken', getRefreshTokenCookieOptions());
    
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
  });

  /**
   * @desc    Refresh access token
   * @route   POST /api/v1/auth/refresh-token
   * @access  Public (Cookie required)
   */
  refreshToken = AsyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken, ipAddress);

    res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());

    res.status(200).json(new ApiResponse(200, { accessToken }, 'Token refreshed successfully'));
  });

  /**
   * @desc    Get current logged in user
   * @route   GET /api/v1/auth/me
   * @access  Private
   */
  getMe = AsyncHandler(async (req, res) => {
    // req.user is set by the authenticateUser middleware
    res.status(200).json(new ApiResponse(200, { user: req.user }, 'Current user fetched'));
  });
}

export default new AuthController();
