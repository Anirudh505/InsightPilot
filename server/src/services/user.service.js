import userRepository from '../repositories/user.repository.js';
import { NotFoundError, BadRequestError } from '../utils/ApiError.js';

class UserService {
  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    // Prevent updating restricted fields directly via profile update
    const restrictedFields = ['email', 'password', 'googleId', 'status', 'isActive'];
    restrictedFields.forEach((field) => delete updateData[field]);

    const updatedUser = await userRepository.updateById(userId, updateData);
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }

  async updateNotificationSettings(userId, settings) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.updateById(userId, {
      notificationSettings: { ...user.notificationSettings, ...settings }
    });

    return updatedUser.notificationSettings;
  }

  async deactivateAccount(userId) {
    const user = await userRepository.softDelete(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return true;
  }
}

export default new UserService();
