import mongoose from 'mongoose';

const dailyAnalyticsSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    // The specific day this document represents (UTC floored to 00:00:00)
    day: { type: Date, required: true, index: true }, 

    // Core Metrics
    dau: { type: Number, default: 0 },            // Daily Active Users
    newUsers: { type: Number, default: 0 },
    returningUsers: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },     // Percentage
    avgSessionDuration: { type: Number, default: 0 }, // Seconds

    // Pre-computed Distributions for the day
    events: { type: Map, of: Number, default: {} },
    browsers: { type: Map, of: Number, default: {} },
    os: { type: Map, of: Number, default: {} },
    devices: { type: Map, of: Number, default: {} },
    countries: { type: Map, of: Number, default: {} },
    referrers: { type: Map, of: Number, default: {} },
    pages: { type: Map, of: Number, default: {} },
    utmSources: { type: Map, of: Number, default: {} },
    utmCampaigns: { type: Map, of: Number, default: {} },

    lastAggregatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

dailyAnalyticsSchema.index({ project: 1, day: 1 }, { unique: true });

export const DailyAnalytics = mongoose.model('DailyAnalytics', dailyAnalyticsSchema);
