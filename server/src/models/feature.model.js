import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, maxlength: 1000, default: '' },
    
    // The core event that defines the usage of this feature
    triggerEvent: { type: String, required: true },
    
    // Optional filters if a feature is defined by an event + a specific property
    filters: [{
      property: { type: String, required: true },
      operator: { type: String, enum: ['eq', 'neq', 'contains'], required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true }
    }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

featureSchema.index({ project: 1, deletedAt: 1 });

export const Feature = mongoose.model('Feature', featureSchema);
