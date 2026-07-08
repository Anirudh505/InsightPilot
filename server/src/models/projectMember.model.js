import mongoose from 'mongoose';
import { ROLE_VALUES, ROLES } from '../constants/roles.js';

const projectMemberSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { 
      type: String, 
      enum: ROLE_VALUES,
      default: ROLES.VIEWER, 
      required: true 
    },
    status: { type: String, enum: ['active', 'pending', 'rejected', 'left'], default: 'active' },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

// Prevent duplicate active memberships
projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

export const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);
