import mongoose from 'mongoose';

// Unlike Events or Sessions, a Journey is a dynamically reconstructed summary 
// of a user's entire lifespan across the product. We can store this as a materialized view
// if needed for performance, but usually it's queried on the fly. 
// For this model, we'll use it to cache a user's unified identity mapping.

const userJourneySchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    
    // The identified internal User ID if they logged in
    userId: { type: String, index: true },
    
    // Array of anonymous UUIDs linked to this single human user (e.g., cross-device)
    anonymousIds: [{ type: String, index: true }],
    
    // Journey summaries
    firstSeenAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
    totalSessions: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    
    // Array of their completed goals
    achievedGoals: [{
      goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'ConversionGoal' },
      achievedAt: { type: Date }
    }],
    
    // User Traits gathered via identify() calls
    traits: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    
    // Primary acquisition source
    acquisition: {
      source: { type: String },
      medium: { type: String },
      campaign: { type: String },
      landingPage: { type: String }
    }
  },
  { timestamps: true }
);

userJourneySchema.index({ project: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $type: "string" } } });
userJourneySchema.index({ project: 1, lastSeenAt: -1 });

export const UserJourney = mongoose.model('UserJourney', userJourneySchema);
