import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
    companySize: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'business', 'enterprise'],
      default: 'free',
    },
    billingEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    membersCount: {
      type: Number,
      default: 1,
    },
    projectsCount: {
      type: Number,
      default: 0,
    },
    analyticsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
organizationSchema.index({ slug: 1 });
organizationSchema.index({ subscriptionPlan: 1 });

export const Organization = mongoose.model('Organization', organizationSchema);
