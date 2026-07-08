import mongoose from 'mongoose';

// Schema for an individual widget within a dashboard
const widgetSchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      enum: [
        'LineChart', 'AreaChart', 'BarChart', 'PieChart', 'Heatmap', 
        'Table', 'Leaderboard', 'KPICard', 'TrendCard', 'FunnelCard', 
        'RetentionMatrix', 'FeatureAdoption', 'AIInsights', 'TopPages', 'TopEvents'
      ], 
      required: true 
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    
    // Configuration dictates what data to fetch
    // e.g., for a FunnelCard, config.funnelId would be present
    // for a KPICard, config.metric = 'DAU'
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
    
    // Grid layout coordinates for the frontend (e.g., React Grid Layout)
    layout: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      w: { type: Number, default: 4 },
      h: { type: Number, default: 4 },
      minW: { type: Number, default: 2 },
      minH: { type: Number, default: 2 }
    }
  }
);

// A dashboard is a collection of widgets
const dashboardSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500, default: '' },
    
    // Type of dashboard for templating or logic
    type: { 
      type: String, 
      enum: ['Executive', 'Product', 'Growth', 'Marketing', 'Engineering', 'Custom'],
      default: 'Custom'
    },
    
    // Is this the default dashboard loaded when opening the project?
    isDefault: { type: Boolean, default: false },
    
    // Embedded array of widgets
    widgets: [widgetSchema],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

dashboardSchema.index({ project: 1, deletedAt: 1 });

export const Dashboard = mongoose.model('Dashboard', dashboardSchema);
