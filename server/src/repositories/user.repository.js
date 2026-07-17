import { User } from '../models/user.model.js';

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(userId) {
    return await User.findById(userId).where({ deletedAt: null });
  }

  async findByEmail(email) {
    return await User.findOne({ email }).where({ deletedAt: null });
  }

  async findByEmailWithPassword(email) {
    return await User.findOne({ email }).select('+password').where({ deletedAt: null });
  }

  async findByGoogleId(googleId) {
    return await User.findOne({ googleId }).where({ deletedAt: null });
  }

  async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).where({ deletedAt: null });
  }

  async softDelete(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { deletedAt: new Date(), isActive: false, status: 'suspended' },
      { new: true }
    );
  }

  async findMany(query = {}, skip = 0, limit = 10) {
    return await User.find({ ...query, deletedAt: null })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async count(query = {}) {
    return await User.countDocuments({ ...query, deletedAt: null });
  }
}

export default new UserRepository();
