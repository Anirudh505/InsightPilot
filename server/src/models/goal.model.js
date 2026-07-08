import mongoose from 'mongoose';

const conversionGoalSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, maxlength: 1000, default: '' },
    
    // What defines the goal completion?
    triggerEvent: { type: String, required: true },
    filters: [{
      property: { type: String, required: true },
      operator: { type: String, enum: ['eq', 'neq', 'gt', 'lt', 'contains'], required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true }
    }],
    
    // Financial tracking (optional)
    valueTracking: {
      enabled: { type: Boolean, default: false },
      propertyKey: { type: String }, // Which property holds the monetary value (e.g. "revenue")
      currency: { type: String, default: 'USD' }
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

conversionGoalSchema.index({ project: 1, deletedAt: 1 });

export const ConversionGoal = mongoose.model('ConversionGoal', conversionGoalSchema);
