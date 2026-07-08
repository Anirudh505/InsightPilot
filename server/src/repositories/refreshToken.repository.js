import { RefreshToken } from '../models/refreshToken.model.js';

class RefreshTokenRepository {
  async create(tokenData) {
    const refreshToken = new RefreshToken(tokenData);
    return await refreshToken.save();
  }

  async findByToken(token) {
    return await RefreshToken.findOne({ token }).populate('user');
  }

  async revoke(token, ipAddress, replacedByToken = null) {
    return await RefreshToken.findOneAndUpdate(
      { token },
      { 
        revoked: true,
        revokedByIp: ipAddress,
        replacedByToken,
      },
      { new: true }
    );
  }

  async revokeAllForUser(userId) {
    return await RefreshToken.updateMany(
      { user: userId, revoked: false },
      { revoked: true }
    );
  }

  async deleteByToken(token) {
    return await RefreshToken.findOneAndDelete({ token });
  }
}

export default new RefreshTokenRepository();
