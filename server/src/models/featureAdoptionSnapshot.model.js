import mongoose from 'mongoose';

const featureAdoptionSnapshotSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    feature: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature', required: true, index: true },
    
    day: { type: Date, required: true, index: true },

    // Core Adoption Metrics
    activeUsers: { type: Number, default: 0 },         // Users who used the feature today
    projectActiveUsers: { type: Number, default: 0 },  // Total DAU for the project today
    adoptionRate: { type: Number, default: 0 },        // (activeUsers / projectActiveUsers) * 100
    
    totalInvocations: { type: Number, default: 0 },    // Total times feature was used today
    averageInvocationsPerUser: { type: Number, default: 0 }, 
    
    // Segments (Optional distributions based on properties)
    countries: { type: Map, of: Number, default: {} },
    devices: { type: Map, of: Number, default: {} },
    
    generatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

featureAdoptionSnapshotSchema.index({ feature: 1, day: 1 }, { unique: true });

export const FeatureAdoptionSnapshot = mongoose.model('FeatureAdoptionSnapshot', featureAdoptionSnapshotSchema);
