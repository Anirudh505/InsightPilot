import mongoose from 'mongoose';
import { ROLE_VALUES, ROLES } from '../constants/roles.js';

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.VIEWER,
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent sending multiple pending invites to the same email for the same org
inviteSchema.index({ email: 1, organization: 1 }, { unique: true });
// Automatically expire documents based on the expiry field
inviteSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

export const Invite = mongoose.model('Invite', inviteSchema);
