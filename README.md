# InsightPilot

**AI Product Analytics SaaS Platform**

InsightPilot is an enterprise-grade product analytics platform that combines classical behavioral analytics (Funnels, Retention, Feature Adoption, User Journeys) with an active, intelligent AI Product Copilot.

## Features
- **Executive Dashboards**: High-level KPIs and real-time monitoring.
- **Metrics Explorer**: Deep dives into custom analytics slices.
- **Funnel Analytics**: Conversion tracking and AI-driven drop-off detection.
- **Retention & Cohorts**: Heatmaps and lifecycle tracking.
- **Feature Adoption**: Usage directories and retention correlation scores.
- **User Journey Explorer**: Sequential event flow tracking.
- **AI Product Copilot**: Conversational analyst with built-in data evidence extraction.

## Architecture
This is a monorepo consisting of:
- **`client/`**: React, Vite, Tailwind CSS, TanStack Query, Recharts.
- **`server/`**: Node.js, Express, PostgreSQL (via Sequelize).
- **`sdk/`**: JavaScript SDK for capturing client-side events.

## Installation & Running

From the root directory:
```bash
# Install dependencies across all workspaces
npm run install:all

# Start both client and server in dev mode
npm run dev
```

For more details, please see the `docs/` folder.
