import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // sparse allows null/undefined values to pass the unique constraint
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default in queries
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    country: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'en',
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authenticationProvider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    notificationSettings: {
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt
  }
);

// Indexes
userSchema.index({ status: 1 });
userSchema.index({ deletedAt: 1 }); // Useful for soft delete queries

// Password Hash Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password Comparison Method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
