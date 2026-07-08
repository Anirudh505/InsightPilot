import mongoose from 'mongoose';

// Defines the cached output of a cohort calculation
const cohortResultSchema = new mongoose.Schema(
  {
    calculatedAt: { type: Date, default: Date.now },
    userCount: { type: Number, default: 0 },
    // A list of user IDs that match this cohort. For massive scale, this could be stored elsewhere (like S3/Redis)
    // but arrays are fine up to ~100k items. We will enforce limits or use references for larger sets.
    users: [{ type: String }] 
  },
  { _id: false }
);

const cohortSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, maxlength: 1000, default: '' },
    
    // Dynamic rules defining the cohort
    // e.g. "Performed 'Purchase' at least 1 time in the last 30 days"
    // OR "Property 'country' equals 'US'"
    rules: [{
      type: { type: String, enum: ['event', 'property', 'session'], required: true },
      event: { type: String }, // e.g. 'Purchase' (if type is event)
      property: { type: String }, // e.g. 'country' or 'browser'
      operator: { type: String, enum: ['eq', 'neq', 'gt', 'lt', 'contains', 'exists'], required: true },
      value: { type: mongoose.Schema.Types.Mixed },
      timeframeDays: { type: Number } // e.g., in the last 30 days
    }],

    // Whether this cohort is static (calculated once) or dynamic (recalculated nightly)
    isDynamic: { type: Boolean, default: true },

    lastResult: { type: cohortResultSchema, default: null },
    calculationStatus: { type: String, enum: ['idle', 'calculating', 'failed'], default: 'idle' },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

cohortSchema.index({ project: 1, deletedAt: 1 });

export const Cohort = mongoose.model('Cohort', cohortSchema);
