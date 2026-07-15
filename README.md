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

- Product screen shots :
- overview
- <img width="978" height="615" alt="Screenshot 2026-07-15 at 12 23 08 PM" src="https://github.com/user-attachments/assets/65bb100f-d43d-4a29-b9d3-27c6edd2cb0d" />

-Funnal
<img width="1276" height="716" alt="Screenshot 2026-07-15 at 4 22 55 PM" src="https://github.com/user-attachments/assets/8dea3063-51b0-4729-b160-6ea97199c9d2" />

-Ai Copilot
<img width="1280" height="714" alt="Screenshot 2026-07-15 at 4 24 13 PM" src="https://github.com/user-attachments/assets/a84bd6f6-cda8-43c1-a6ce-19e191cbe5a1" />




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
# InsightPilot
