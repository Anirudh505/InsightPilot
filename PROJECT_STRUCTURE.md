# InsightPilot Project Structure

## Root Level
- `client/`: React application (Vite, Tailwind, TanStack Query, Recharts).
- `server/`: Node.js Express backend API.
- `sdk/`: JavaScript tracking snippet SDK.
- `docs/`: Technical documentation (PRDs, Architecture, API spec).
- `architecture/`: Architecture diagrams and design documents.
- `docker/`: Dockerfiles and infrastructure configurations.
- `scripts/`: Build and utility scripts.
- `assets/`: Static assets (Logos, icons).
- `screenshots/`: App screenshots organized by feature.

## Monorepo Commands
- `npm run dev`: Starts both frontend and backend concurrently.
- `npm run install:all`: Installs all dependencies across workspaces.
- `npm run build`: Builds client and SDK for production.
