import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    replacedByToken: {
      type: String,
      default: null,
    },
    createdByIp: {
      type: String,
    },
    revokedByIp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to check if token is expired
refreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt;
});

// Virtual property to check if token is active
refreshTokenSchema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired;
});

// Ensure virtuals are included in JSON/Object conversions
refreshTokenSchema.set('toJSON', { virtuals: true });
refreshTokenSchema.set('toObject', { virtuals: true });

// Auto-delete expired tokens (TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
