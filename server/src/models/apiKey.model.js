import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    publicKey: { type: String, required: true, unique: true, index: true },
    secretHash: { type: String, required: true }, // Store hashed secret, NEVER plaintext
    environment: { type: String, enum: ['development', 'staging', 'production'], required: true },
    permissions: [{ type: String }],
    status: { type: String, enum: ['active', 'revoked'], default: 'active' },
    expiresAt: { type: Date, default: null },
    lastUsedAt: { type: Date, default: null },
    usageCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

apiKeySchema.index({ project: 1, status: 1 });

export const ApiKey = mongoose.model('ApiKey', apiKeySchema);
