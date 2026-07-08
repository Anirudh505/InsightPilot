import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    // Identity
    sessionId: { type: String, required: true, unique: true, index: true },
    anonymousId: { type: String, required: true, index: true },
    userId: { type: String, index: true, default: null },

    // Session Metrics
    startedAt: { type: Date, required: true, index: true },
    endedAt: { type: Date, default: null },
    durationSeconds: { type: Number, default: 0 },
    
    // Engagement
    pageCount: { type: Number, default: 1 },
    eventCount: { type: Number, default: 1 },
    isBounce: { type: Boolean, default: true }, // Becomes false if pageCount > 1 or duration > 30s
    
    // Context (Captured at start of session)
    entryPage: { type: String },
    exitPage: { type: String },
    referrer: { type: String },
    
    // Attribution (Captured at start)
    campaign: {
      source: { type: String },
      medium: { type: String },
      name: { type: String }
    },
    
    // Device & Location Profile for the session
    browser: { type: String },
    os: { type: String },
    deviceType: { type: String },
    country: { type: String }
  },
  { timestamps: true }
);

sessionSchema.index({ project: 1, startedAt: -1 });
sessionSchema.index({ anonymousId: 1, startedAt: -1 });

export const Session = mongoose.model('Session', sessionSchema);
