import mongoose from 'mongoose';
import { ROLE_VALUES, ROLES } from '../constants/roles.js';
import { PERMISSION_VALUES } from '../constants/permissions.js';

const organizationMemberSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.VIEWER,
      required: true,
    },
    permissions: [
      {
        type: String,
        enum: PERMISSION_VALUES,
      },
    ],
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'left'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from having multiple active memberships in the same organization
organizationMemberSchema.index({ organization: 1, user: 1 }, { unique: true });

export const OrganizationMember = mongoose.model('OrganizationMember', organizationMemberSchema);
