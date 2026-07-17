import mongoose from 'mongoose';

const hourlyAnalyticsSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    // The specific hour this document represents (UTC)
    // Stored as a date object floored to the hour (e.g. 2023-10-25T14:00:00.000Z)
    hour: { type: Date, required: true }, 

    // Pre-computed Metrics
    totalEvents: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    bounces: { type: Number, default: 0 },
    
    // Identity arrays for the hour (used to roll up into Daily unique calculations)
    // We store unique IDs seen this hour. For massive scale, this could be HyperLogLog, 
    // but arrays work for standard scale.
    activeUsers: [{ type: String }],
    activeAnonymous: [{ type: String }],
    
    // Distribution Maps (Key-Value aggregations)
    events: { type: Map, of: Number, default: {} },        // e.g. { "Purchase": 5, "Login": 10 }
    browsers: { type: Map, of: Number, default: {} },
    os: { type: Map, of: Number, default: {} },
    devices: { type: Map, of: Number, default: {} },
    countries: { type: Map, of: Number, default: {} },
    referrers: { type: Map, of: Number, default: {} },
    pages: { type: Map, of: Number, default: {} },
    
    lastAggregatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Compound Index for fast lookup by project and hour
hourlyAnalyticsSchema.index({ project: 1, hour: 1 }, { unique: true });

// TTL Index: Delete hourly data after 90 days to save space. 
// Long-term trends use daily/monthly snapshots.
hourlyAnalyticsSchema.index({ hour: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const HourlyAnalytics = mongoose.model('HourlyAnalytics', hourlyAnalyticsSchema);
