import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, maxlength: 1000, default: '' },
    logo: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscriptionPlan: { type: String, enum: ['free', 'pro', 'business', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'suspended', 'archived'], default: 'active' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

workspaceSchema.index({ slug: 1 });
workspaceSchema.index({ deletedAt: 1 });

export const Workspace = mongoose.model('Workspace', workspaceSchema);
