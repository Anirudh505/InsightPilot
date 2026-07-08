import mongoose from 'mongoose';

const copilotMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    
    // If the AI references specific charts, data points, or insights, we store the metadata here
    references: [{
      type: { type: String, enum: ['insight', 'funnel', 'retention', 'feature', 'segment'] },
      id: { type: mongoose.Schema.Types.ObjectId },
      summary: { type: String }
    }],
    
    // Usage stats from the AI Provider for billing
    tokensUsed: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const copilotConversationSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Who started the chat
    
    title: { type: String, default: 'New Conversation' },
    
    messages: [copilotMessageSchema],

    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

copilotConversationSchema.index({ project: 1, user: 1, updatedAt: -1 });

export const CopilotConversation = mongoose.model('CopilotConversation', copilotConversationSchema);
