import mongoose from 'mongoose';

// Flexible snapshot model to store historical data without recalculating
const analyticsSnapshotSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    
    // Type of snapshot: 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'
    type: { type: String, required: true, index: true },
    
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    // The pre-calculated snapshot data
    metrics: {
      activeUsers: { type: Number, default: 0 },
      newUsers: { type: Number, default: 0 },
      sessions: { type: Number, default: 0 },
      pageViews: { type: Number, default: 0 },
      events: { type: Number, default: 0 },
      bounceRate: { type: Number, default: 0 },
      avgSessionDuration: { type: Number, default: 0 }
    },
    
    // Can optionally hold top 10 arrays for historical charting
    topEvents: [{ name: String, count: Number }],
    topPages: [{ path: String, views: Number }],
    topReferrers: [{ source: String, count: Number }],

    generatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

analyticsSnapshotSchema.index({ project: 1, type: 1, startDate: 1 }, { unique: true });

export const AnalyticsSnapshot = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
