import mongoose from 'mongoose';

const retentionSnapshotSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    // The starting day (Day 0) of this retention cohort
    cohortDate: { type: Date, required: true, index: true },
    
    // Number of users who triggered the "Start Event" on Day 0
    cohortSize: { type: Number, required: true, default: 0 },
    
    // Configurable retention parameters
    startEvent: { type: String, default: 'Any Event' }, // Event indicating acquisition/start
    returnEvent: { type: String, default: 'Any Event' }, // Event indicating retention

    // A mapping of Day-N to retained user counts
    // e.g., { "1": 50, "3": 40, "7": 25, "14": 10, "30": 5 }
    retentionMatrix: { type: Map, of: Number, default: {} },

    generatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// We want to uniquely identify a snapshot by the day and the events being tracked
retentionSnapshotSchema.index({ project: 1, cohortDate: 1, startEvent: 1, returnEvent: 1 }, { unique: true });

export const RetentionSnapshot = mongoose.model('RetentionSnapshot', retentionSnapshotSchema);
