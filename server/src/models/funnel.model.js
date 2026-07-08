import mongoose from 'mongoose';

// Defines a single step in a funnel sequence
const funnelStepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    eventName: { type: String, required: true },
    // Optional filters for this step (e.g., only "Purchase" events where "currency" is "USD")
    filters: [{
      property: { type: String, required: true },
      operator: { type: String, enum: ['eq', 'neq', 'gt', 'lt', 'contains'], required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true }
    }]
  },
  { _id: false }
);

// Defines the cached output of a funnel calculation
const funnelResultSchema = new mongoose.Schema(
  {
    calculatedAt: { type: Date, default: Date.now },
    dateRange: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    totalUsersStarted: { type: Number, default: 0 },
    totalUsersCompleted: { type: Number, default: 0 },
    overallConversionRate: { type: Number, default: 0 }, // Percentage
    overallMedianTimeSeconds: { type: Number, default: 0 },
    steps: [{
      order: { type: Number },
      eventName: { type: String },
      usersCompleted: { type: Number },
      dropOffPercentage: { type: Number },
      medianTimeFromPreviousSeconds: { type: Number }
    }]
  },
  { _id: false }
);

const funnelSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, maxlength: 1000, default: '' },
    
    // The sequence of events defining the funnel
    steps: [funnelStepSchema],
    
    // Funnel configuration
    conversionWindowMinutes: { type: Number, default: 60 * 24 * 7 }, // Defaults to 7 days to complete
    
    // Cached calculation results
    lastResult: { type: funnelResultSchema, default: null },
    calculationStatus: { type: String, enum: ['idle', 'calculating', 'failed'], default: 'idle' },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

funnelSchema.index({ project: 1, deletedAt: 1 });

export const Funnel = mongoose.model('Funnel', funnelSchema);
