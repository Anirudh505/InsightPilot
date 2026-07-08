import mongoose from 'mongoose';

const segmentResultSchema = new mongoose.Schema(
  {
    calculatedAt: { type: Date, default: Date.now },
    userCount: { type: Number, default: 0 },
    users: [{ type: String }] 
  },
  { _id: false }
);

const segmentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, maxlength: 1000, default: '' },
    
    // Segment logic can be slightly more advanced than cohorts, including journey metadata
    rules: [{
      type: { type: String, enum: ['event', 'property', 'session', 'journey', 'feature'], required: true },
      key: { type: String }, // e.g. 'country' or 'Purchase' or featureId
      operator: { type: String, enum: ['eq', 'neq', 'gt', 'lt', 'contains', 'exists'], required: true },
      value: { type: mongoose.Schema.Types.Mixed },
      timeframeDays: { type: Number } 
    }],

    // AND / OR logic between rules
    logicOperator: { type: String, enum: ['AND', 'OR'], default: 'AND' },

    isDynamic: { type: Boolean, default: true },
    lastResult: { type: segmentResultSchema, default: null },
    calculationStatus: { type: String, enum: ['idle', 'calculating', 'failed'], default: 'idle' },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

segmentSchema.index({ project: 1, deletedAt: 1 });

export const Segment = mongoose.model('Segment', segmentSchema);
