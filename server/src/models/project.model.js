import mongoose from 'mongoose';

const projectSettingsSchema = new mongoose.Schema(
  {
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    retentionDays: { type: Number, default: 30 },
    defaultDashboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Dashboard', default: null },
    trackingEnabled: { type: Boolean, default: true },
    aiEnabled: { type: Boolean, default: true },
    emailReports: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    notificationSettings: {
      alerts: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true }
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, maxlength: 1000, default: '' },
    icon: { type: String, default: '' },
    environment: { type: String, enum: ['development', 'staging', 'production'], default: 'production' },
    platform: { type: String, enum: ['web', 'ios', 'android', 'backend', 'other'], default: 'web' },
    domain: { type: String, default: '' },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'paused', 'archived'], default: 'active' },
    archivedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    settings: { type: projectSettingsSchema, default: () => ({}) }
  },
  { timestamps: true }
);

// Slug should be unique within a workspace
projectSchema.index({ workspace: 1, slug: 1 }, { unique: true });
projectSchema.index({ deletedAt: 1 });

export const Project = mongoose.model('Project', projectSchema);
