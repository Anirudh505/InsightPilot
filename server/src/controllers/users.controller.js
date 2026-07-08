import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
// import userService from '../services/user.service.js';

class UserController {
  /**
   * @desc    Get current user profile
   * @route   GET /api/v1/users/me
   * @access  Private
   */
  getProfile = AsyncHandler(async (req, res) => {
    // const userId = req.user._id; // Assumes auth middleware sets req.user
    // const user = await userService.getUserProfile(userId);
    res.status(200).json(new ApiResponse(200, {}, 'User profile fetched successfully (Skeleton)'));
  });

  /**
   * @desc    Update user profile
   * @route   PUT /api/v1/users/me
   * @access  Private
   */
  updateProfile = AsyncHandler(async (req, res) => {
    // const userId = req.user._id;
    // const updateData = req.body;
    // const updatedUser = await userService.updateProfile(userId, updateData);
    res.status(200).json(new ApiResponse(200, {}, 'User profile updated successfully (Skeleton)'));
  });

  /**
   * @desc    Update user notification settings
   * @route   PATCH /api/v1/users/me/notifications
   * @access  Private
   */
  updateNotificationSettings = AsyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, {}, 'Notification settings updated (Skeleton)'));
  });

  /**
   * @desc    Deactivate user account
   * @route   DELETE /api/v1/users/me
   * @access  Private
   */
  deactivateAccount = AsyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, {}, 'Account deactivated (Skeleton)'));
  });
}

export default new UserController();
