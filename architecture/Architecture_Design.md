# InsightPilot: Enterprise Architecture Blueprint

*Tagline: Understand User Behavior. Build Better Products.*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 1: High-Level Architecture

**Overview:**
InsightPilot is designed as a modular, decoupled, cloud-native SaaS platform. The architecture separates the client-facing presentation layer, the core business logic API, the high-throughput analytics ingestion pipeline, and the heavy-lifting data storage layers.

**Interactions:**
1. **Frontend (Next.js):** Served via edge CDN (Vercel), providing the UI. It communicates with the backend via REST APIs and maintains real-time websocket connections (Socket.IO) for instant AI insights and collaborative dashboard updates.
2. **Backend (Node.js/Express):** Acts as the central nervous system. It exposes RESTful APIs, handles authentication, and orchestrates business logic.
3. **Analytics Engine:** The backend receives telemetry data from client SDKs. Events are validated, enriched, and batched before being written to PostgreSQL (partitioned for high-volume event data). 
4. **AI Services:** The backend securely communicates with the OpenAI API. It sends anonymized/aggregated query schemas to translate natural language into SQL, and processes results back into plain-English insights.
5. **Database (PostgreSQL via Prisma):** The single source of truth for both relational application state (Users, Projects) and structured analytics data.
6. **Caching (Redis):** Used for session management, rate limiting API requests, and caching computationally heavy analytical query results (e.g., complex funnel calculations).
7. **Storage:** Cloudinary handles dynamic image optimization (e.g., user avatars), while AWS S3 abstractions store static exports (CSV/PDF reports).
8. **Notifications:** Background workers pick up events (e.g., "anomaly detected") and route them via email (SendGrid/AWS SES) or webhooks.
9. **Monitoring:** All components emit structured logs and metrics to a centralized monitoring stack for observability.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 2: Architecture Diagram

```text
                               +-------------------+
                               |   Client Browser  |
                               | (SDKs & Web App)  |
                               +---------+---------+
                                         |
                                         v
                              +---------------------+
                              | CDN & Edge (Vercel) |
                              +---------+-----------+
                                        | (HTTPS / WSS)
                                        v
                            +-----------------------+
                            |     API Gateway       |
                            |    (Load Balancer)    |
                            +-----------+-----------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
   +---------------------------+                 +---------------------------+
   |   Frontend Application    |                 |   Backend Core Services   |
   | (Next.js 15, React 19)    |                 | (Node.js, Express.js)     |
   +---------------------------+                 +-------------+-------------+
                                                               |
    +------------------+------------------+------------------+ | +------------------+
    |                  |                  |                  | | |                  |
    v                  v                  v                  v | v                  v
+-------+       +-------------+    +-------------+     +-------+-+-------+  +---------------+
| Redis |       | PostgreSQL  |    | AI Layer    |     | Storage Layer   |  | Monitoring &  |
| Cache |       | (Prisma ORM)|    | (OpenAI API)|     | (S3/Cloudinary) |  | Logging       |
+-------+       +-------------+    +-------------+     +-----------------+  +---------------+
 (Sessions,      (Core Data &       (NLQ, Insights,     (Avatars, Exports)   (Prometheus,
  Rate limits,    Event Storage)     Copilot)                                 ELK/Datadog)
  Aggregations)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 3: Frontend Architecture

**Folder Structure:**
The architecture strictly follows a **Feature-Based** paradigm (`src/features/*`), avoiding giant flat folders of isolated components.

**Feature-Based Architecture:**
Each feature (e.g., `auth`, `dashboards`, `funnels`) contains its own `components`, `hooks`, `types`, `api` (React Query functions), and `utils`. This encapsulates domain logic and prevents tight coupling.

**Reusable Components:**
`src/components/ui/` houses primitive, generic Shadcn UI components (Buttons, Inputs, Dialogs). These are highly isolated, accessible, and strictly visual.

**Layouts & Routing:**
Leveraging Next.js App Router (`app/`). Layouts (`layout.tsx`) wrap specific route groups (e.g., `(auth)`, `(dashboard)`), ensuring that navbars, sidebars, and Socket.IO contexts are mounted once and preserved across navigations.

**State Management:**
- **Server State:** Managed entirely by React Query (`@tanstack/react-query`). It handles caching, background fetching, and optimistic updates.
- **Form State:** Managed by React Hook Form integrated with Zod for robust, typed client-side validation.
- **Local UI State:** React Context/Zustand (for global UI preferences like theme or open sidebar state) and local `useState`.

**Error Boundaries & Loading:**
Every route segment utilizes `error.tsx` and `loading.tsx` to ensure partial hydration and graceful degradation. Skeletons (using Framer Motion for smooth transitions) are shown during data fetches.

**Code Splitting & Lazy Loading:**
Next.js handles route-based code splitting by default. Heavy charting libraries (e.g., Recharts/Visx) and the AI Copilot chat interface are dynamically imported (`next/dynamic`) to keep the initial JS bundle tiny.

**Accessibility & Internationalization:**
All Shadcn components utilize Radix UI primitives ensuring WAI-ARIA compliance, keyboard navigation, and screen reader support. Internationalization (`next-intl`) is abstracted into a wrapper to easily support multiple locales in the future.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 4: Backend Architecture

**Layered Architecture:**
Follows a strict Controller-Service-Repository pattern.
1. **Controllers:** Handle HTTP requests, extract parameters, and return HTTP responses. No business logic lives here.
2. **Services:** Contain the core business logic. They process data, enforce business rules, and call repositories.
3. **Repositories:** Abstractions over Prisma. They handle all direct database queries.

**Middleware:**
Global middleware for CORS, Helmet (security headers), Rate Limiting, and Body Parsing. Route-specific middleware for Authentication (JWT verification), Role/Permission authorization, and request payload validation.

**Validation:**
Incoming request bodies, queries, and params are validated using Zod at the router/middleware level before reaching the controller.

**Dependency Injection Strategy:**
While Node doesn't require strict OOP DI containers, we pass dependencies (Repositories to Services, Services to Controllers) via factory functions or constructor injection. This makes unit testing services with mocked repositories trivial.

**Shared Utilities:**
Helper functions for cryptography, date-time manipulation, and formatting live in a `shared/utils` directory.

**Error Handling & Logging:**
A global error-handling middleware catches all unhandled exceptions. Custom API Error classes (e.g., `NotFoundError`, `UnauthorizedError`) map to specific HTTP status codes. All errors are logged securely using a centralized logging strategy (Winston/Pino) without leaking sensitive stack traces to the client.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 5: Database Design (ER Model)

**Core Entities & Relationships:**
- **Users:** (1:M) UserSessions, (1:M) Memberships (to Organizations).
- **Organizations:** The top-level tenant. (1:M) Projects, (1:M) Subscriptions, (1:M) Memberships, (1:M) Invitations.
- **Projects:** Logical product containers. (1:M) Events, (1:M) Funnels, (1:M) Dashboards, (1:M) API Keys, (1:M) Feature Flags, (1:M) Experiments.
- **Roles & Permissions:** System-wide definitions. A Membership links a User, an Organization, and a Role.
- **Events:** The core analytics data payload. Linked to a Project and uniquely identified by an anonymous/resolved user ID.
- **Funnels:** Defined series of event steps. Linked to a Project.
- **Dashboards:** Collections of reports. Linked to a Project. (1:M) Reports.
- **Reports:** Specific widget definitions (charts, cohorts). Linked to a Dashboard.
- **Notifications:** Alerts generated for Users based on trigger conditions.
- **Audit Logs:** Immutable record of significant actions (linked to Organization and User).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 6: Database Schema Planning

1. **Users**
   - *Purpose:* Identity management.
   - *PK:* `id` (UUID).
   - *Columns:* `email` (Unique), `passwordHash`, `isVerified`, `createdAt`.
   - *Indexes:* B-Tree on `email`.

2. **Organizations**
   - *Purpose:* Multi-tenant isolation boundary.
   - *PK:* `id` (UUID).
   - *Columns:* `name`, `billingId`.

3. **Projects**
   - *Purpose:* Data segregation within an org (e.g., "Web App", "iOS App").
   - *PK:* `id` (UUID).
   - *FKs:* `organizationId` -> Organizations(id).
   - *Cascade:* ON DELETE CASCADE.

4. **Events**
   - *Purpose:* Storing tracked telemetry.
   - *PK:* `id` (UUID or Time-Series specific ID).
   - *Columns:* `eventName` (String), `distinctId` (String - user identifier), `properties` (JSONB), `timestamp` (DateTime).
   - *FKs:* `projectId` -> Projects(id).
   - *Indexes:* BRIN index on `timestamp`, GIN index on `properties`, B-Tree on (`projectId`, `eventName`, `timestamp`).

5. **Funnels**
   - *Purpose:* Saved conversion path definitions.
   - *PK:* `id` (UUID).
   - *Columns:* `name`, `steps` (JSONB array of event names/conditions).

6. **Dashboards**
   - *PK:* `id` (UUID).
   - *Columns:* `name`, `layout` (JSONB).

7. **API Keys**
   - *Purpose:* Authenticating SDK ingestion.
   - *PK:* `id` (UUID).
   - *Columns:* `keyHash` (Unique), `type` (public/secret).
   - *Validation:* Secret keys are never returned in plaintext after creation.

8. **Audit Logs**
   - *Purpose:* Compliance and security tracking.
   - *PK:* `id` (UUID).
   - *Columns:* `action`, `resourceType`, `resourceId`, `ipAddress`.
   - *Indexes:* B-Tree on `organizationId`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 7: Prisma Planning

**Folder Structure:**
```
/prisma
  ├── schema.prisma      (Single source of truth)
  ├── migrations/        (Auto-generated SQL diffs)
  └── seed.ts            (Database population script)
```

**Migration Strategy:**
- All schema changes require a PR.
- Prisma migration files (`.sql`) are committed to version control.
- In CI/CD, `prisma migrate deploy` runs before the new application containers are spun up to ensure schema compatibility.

**Seed Strategy:**
- `seed.ts` will generate a baseline of Roles, Permissions, and a Dummy Organization with fake historical `Events` for local development and staging environments using `faker.js`.

**Environment Management:**
- `DATABASE_URL` is injected via environment variables. Connection pooling is managed using Prisma's built-in connection pool settings, optimized for the deployment environment's constraints.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 8: Authentication Flow

**Design:**
- **Signup/Login:** User provides email/password. Password hashed via Argon2. On success, an Access Token (JWT) and a Refresh Token (Opaque string stored in DB) are generated.
- **JWT:** Short-lived (15 minutes). Sent in the `Authorization` header as a Bearer token. Contains `userId` and `orgId`.
- **Refresh Tokens:** Long-lived (7 days). Stored in a secure, `HttpOnly`, `SameSite=Strict` cookie to prevent XSS.
- **Session Management:** The `UserSessions` table tracks active refresh tokens, allowing users to view and revoke sessions across devices.
- **Google OAuth:** Redirects to Google, exchanges code for profile, matches or creates User, and issues standard tokens.
- **Email Verification / Password Reset:** Generates secure, short-lived, single-use crypto-tokens stored in DB, sent via SendGrid.

**Multi-organization support:**
Users can belong to multiple organizations. The active `organizationId` is passed in API requests, and middleware verifies the user's membership and permissions against that specific org.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 9: Authorization

**Roles:**
- **Owner:** Full destructive rights (delete org, billing).
- **Admin:** Manage users, API keys, projects.
- **Manager:** Create/edit dashboards, funnels, invite members.
- **Member:** Create/edit dashboards, view data.
- **Viewer:** Read-only access to dashboards and reports.

**Permission Matrix (Implementation):**
A granular permission string system (e.g., `dashboards:read`, `projects:write`).
Middleware intercepts requests:
`requirePermission('events:read')` checks the user's role in the active organization, maps the role to its permissions, and accepts/rejects the request.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 10: API Design

**Base URL:** `/api/v1`

**Authentication:**
- `POST /auth/register` (Public) - Create account.
- `POST /auth/login` (Public) - Issue tokens.
- `POST /auth/refresh` (Cookie required) - Issue new JWT.
- `POST /auth/logout` (Auth required) - Revoke refresh token.

**Projects:**
- `GET /organizations/:orgId/projects` (Auth: Member+) - List projects.
- `POST /organizations/:orgId/projects` (Auth: Admin+) - Create project.

**Events (Ingestion):**
- `POST /track` (Auth: API Key) - Ingest single/batch events.
- `GET /projects/:projectId/events/properties` (Auth: Member+) - Get schema/taxonomy.

**Analytics (Querying):**
- `POST /projects/:projectId/analytics/funnel` (Auth: Viewer+) - Calculate funnel. Body: steps, timeframe.
- `POST /projects/:projectId/analytics/retention` (Auth: Viewer+) - Calculate cohort retention.

**Dashboards:**
- `GET /projects/:projectId/dashboards` (Auth: Viewer+)
- `POST /projects/:projectId/dashboards` (Auth: Member+)
- `PUT /projects/:projectId/dashboards/:dashId` (Auth: Member+)

**AI Copilot:**
- `POST /projects/:projectId/ai/ask` (Auth: Member+) - NLQ query. Body: `{ "query": "Why did signups drop?" }`.

*(Standard HTTP error codes: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests, 500 Internal Server Error)*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 11: Event Tracking Architecture

**Client Events:**
Frontend SDKs batch events in memory (e.g., every 10 events or 3 seconds) to reduce network requests. Uses `navigator.sendBeacon` for reliability during page unloads.
**Backend Events:**
Node/Python SDKs for server-side tracking (e.g., "Subscription Upgraded" from Stripe webhook) bypassing client-side ad-blockers.
**Payload Structure:**
Requires `eventName`, `timestamp`, `distinctId` (anonymous UUID until user logs in, then canonical User ID), and `properties` (JSON object).
**Validation:**
Ingestion API performs minimal schema validation (Zod) to ensure speed, dropping malformed payloads and returning a 202 Accepted quickly, pushing processing to background queues.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 12: Analytics Engine

**Data Storage (PostgreSQL Optimization):**
Events are stored in a table heavily utilizing JSONB. We will use PostgreSQL Table Partitioning (by date) to ensure query performance on large datasets.

**Funnels:**
Calculated using complex SQL `JOIN`s or Window Functions (`LEAD()`, `LAG()`) partitioned by `distinctId` to ensure chronological step completion within the specified conversion window.

**Retention & Cohorts:**
Calculated by establishing a cohort size (users performing the starting event in week 0) and measuring intersection with users performing the return event in weeks 1, 2, 3.

**Pre-aggregation:**
Background Cron jobs pre-calculate daily active users (DAU) and standard event counts, storing them in aggregate tables so standard dashboard load times are sub-100ms.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 13: AI Layer

**Architecture:**
- **NL to SQL (Natural Language to SQL):** When a user asks a question, the backend retrieves the Project's Data Schema (event names, property types). It sends a heavily engineered prompt + the schema (NO raw user data) to the OpenAI API (gpt-4o) to generate a secure, read-only SQL query.
- **Execution & Interpretation:** The backend safely executes the SQL against the analytics DB. The results (JSON) are sent back to the LLM to generate a plain-English explanation.
- **RAG Architecture (Future):** We will implement pgvector to store embeddings of previous queries, reports, and documentation to provide context-aware insights automatically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 14: Caching Strategy (Redis)

- **Sessions & Tokens:** Storing valid refresh tokens and invalidating revoked JWTs (token blacklisting).
- **Rate Limiting:** Sliding window algorithms to protect ingestion APIs and AI endpoints from abuse.
- **Analytics Caching:** Dashboard queries are highly repetitive. Redis will cache the JSON response of analytical queries with a TTL (e.g., 15 minutes). Cache keys will be a hash of the query parameters and project ID. Cache is invalidated if the underlying dashboard configuration changes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 15: Notification System

**Design:**
An asynchronous event-driven system.
When an alert threshold is met (e.g., conversion drops by 10%), the Analytics engine pushes an event to a Redis Queue (BullMQ).
A Notification Worker processes the queue, checks user preferences, and formats the message.
- **Email:** Dispatched via SendGrid API.
- **In-App:** Pushed to the client in real-time via Socket.IO and saved to the DB for offline viewing.
- **Slack/Webhooks:** Dispatched via standard HTTP POST requests with retry logic and exponential backoff.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 16: File Storage

**Architecture:**
- **Images (Avatars, Workspace Logos):** Uploaded directly from the client to Cloudinary using signed upload URLs generated by the backend. Cloudinary handles cropping, compression, and global CDN delivery.
- **Exports (CSV, PDF Reports):** When a large export is requested, a background worker generates the file, uploads it to an AWS S3 bucket (with private ACLs), and generates a pre-signed URL valid for 60 minutes. The URL is then sent to the user via Socket.IO or email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 17: Search Architecture

**Design:**
- **Phase 1 (PostgreSQL FTS):** Global search (finding dashboards, projects, or team members) utilizes PostgreSQL Full-Text Search. We will create GIN indexes on `tsvector` columns for fast querying across text fields.
- **Phase 2 (Elasticsearch Readiness):** The application repository pattern ensures the search logic is abstracted. When data volume exceeds Postgres FTS capabilities, we will replicate core entity metadata to Elasticsearch via logical decoding/Debezium for distributed, typo-tolerant search.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 18: Security Architecture

- **Helmet:** Sets strict HTTP headers (HSTS, NoSniff, FrameGuard) to prevent common vulnerabilities.
- **Rate Limiting:** Strict limits on auth endpoints (brute-force protection) and tier-based limits on API ingestion.
- **CORS:** Strictly configured to only allow requests from the verified frontend origin.
- **XSS & CSRF:** Prevented by using React (auto-escapes inputs) and storing sensitive refresh tokens in `HttpOnly` cookies.
- **Input Validation:** Zod ensures no malformed or malicious payloads reach the database layer.
- **Password Hashing:** Argon2id (industry standard for resistance to GPU cracking).
- **Secrets Management:** Environment variables provided securely via cloud provider (Vercel/Railway) vaults. No secrets in version control.
- **Data Isolation:** All database queries implicitly include `WHERE organizationId = ?` and `projectId = ?` to prevent cross-tenant data leakage.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 19: Scalability Plan

- **Horizontal Scaling:** The Node.js backend is completely stateless (sessions in Redis). It can scale horizontally behind a load balancer to handle unlimited traffic spikes.
- **Database Scaling:** PostgreSQL handles writes. As analytics volume grows, we will implement read replicas for dashboard querying to ensure ingestion (writes) never impacts dashboard performance (reads).
- **Background Workers:** Heavy tasks (CSV generation, AI analysis, email sending) are offloaded to Redis queues processed by independent worker dynos, keeping the main API thread unblocked.
- **Microservices Readiness:** The modular monolithic folder structure ensures that if the Analytics Ingestion pipeline requires a rewrite in Go or Rust for throughput, it can be seamlessly extracted into a microservice.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 20: Performance Strategy

- **Query Optimization:** Extensive use of database indexing (B-Tree, GIN, BRIN). Explaining and analyzing critical paths (like funnel generation) to prevent sequential scans.
- **API Optimization:** GZIP/Brotli compression for all JSON responses.
- **Pagination:** Cursor-based pagination (using the last seen ID/Timestamp) for high-volume endpoints (e.g., event logs) instead of offset-based pagination to maintain O(1) query time.
- **Virtualization:** React Window/Virtuoso used on the frontend to render lists of thousands of events without freezing the DOM.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 21: Logging Strategy

- **Application Logs:** Structured JSON logging via Pino. Includes trace IDs to track a request across services.
- **Audit Logs:** Written to a dedicated PostgreSQL table for compliance (who did what, when).
- **Error Logs:** Piped to an error tracking service (e.g., Sentry) with sourcemaps to pinpoint exact lines of code failing in production.
- **Sanitization:** Strict middleware filters ensure no passwords, PII, or API keys are ever printed to stdout logs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 22: Monitoring

- **Health Checks:** `/health` endpoint checks DB connection and Redis ping to assure load balancers the instance is alive.
- **Metrics:** Utilizing `prom-client` to expose `/metrics` for Prometheus scraping. Key metrics: Request duration, error rates, CPU/Memory usage, active websocket connections.
- **Dashboards:** Grafana dashboards visualize the Prometheus data, with configured alerts (e.g., PagerDuty) if the API 500-error rate exceeds 1% or latency spikes above 500ms.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 23: Deployment Architecture

- **Development:** Docker Compose handles spinning up local PostgreSQL and Redis instantly.
- **Staging/Production Pipeline:**
  - GitHub Actions runs ESLint, TypeScript compilation, and Unit Tests on every PR.
  - On merge to `main`, GitHub Actions triggers deployment.
- **Frontend Hosting:** Vercel. Provides Edge caching, automatic PR previews, and zero-downtime CI/CD.
- **Backend Hosting:** Railway (or AWS ECS). Connects to GitHub, builds the Docker image, and deploys. Auto-scaling rules configured based on CPU usage.
- **Database:** Managed PostgreSQL (e.g., Supabase/AWS RDS) with automated daily backups and point-in-time recovery.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 24: Folder Structure

**Monorepo Strategy (TurboRepo recommended):**

```text
/insightpilot
├── apps
│   ├── web                   (Next.js Frontend)
│   │   ├── src
│   │   │   ├── app           (Next.js App Router)
│   │   │   ├── components    (Shared UI)
│   │   │   ├── features      (Domain logic: auth, analytics)
│   │   │   ├── hooks
│   │   │   └── lib           (API clients, Utils)
│   ├── api                   (Node.js Backend)
│       ├── src
│           ├── controllers
│           ├── services
│           ├── repositories
│           ├── middleware
│           ├── routes
│           └── utils
├── packages
│   ├── database              (Prisma schema, migrations, seed)
│   ├── config                (ESLint, TSConfig shared configs)
│   └── shared-types          (Zod schemas, TS Interfaces used by both)
├── docker-compose.yml
└── package.json
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 25: Engineering Standards

- **Naming Conventions:** camelCase for variables/functions, PascalCase for React Components/Classes, UPPER_SNAKE_CASE for constants.
- **Git Strategy:** Trunk-based development. Short-lived feature branches (`feat/dashboard-ui`, `fix/login-bug`) merging frequently into `main`.
- **Commit Conventions:** Conventional Commits (`feat: add login`, `fix: resolve crash on null event`). Automates changelog generation.
- **Code Review:** Required PR approvals. Checklist includes: Does this scale? Are there tests? Is PII logged? Are DB migrations non-destructive?
- **Documentation:** JSDoc/TSDoc for complex backend services. Storybook for frontend UI components.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 26: Implementation Roadmap

**Milestone 1: Infrastructure & Foundation (High Complexity)**
- Repo setup, Docker Compose, CI/CD pipelines, Database schema modeling, Authentication flow (JWT, Google OAuth).
*Result: Users can sign up, log in, and manage organizations/projects.*

**Milestone 2: Analytics Ingestion (High Complexity)**
- Tracking API, SDK creation, Redis rate limiting, Event validation, partitioning strategy implementation.
*Result: System can securely ingest and store thousands of events per second.*

**Milestone 3: Core Frontend & Visualizations (Medium Complexity)**
- UI scaffolding, Dashboard layouts, Chart integrations, Time-series and basic data querying.
*Result: Users can view basic charts of their ingested data.*

**Milestone 4: Advanced Analytics Engine (Very High Complexity)**
- Funnel calculation logic, Cohort retention queries, Pre-aggregation cron jobs.
*Result: Users can build complex funnels and understand user drop-off.*

**Milestone 5: The AI Layer (Medium Complexity)**
- OpenAI integration, NL to SQL prompt engineering, Chat UI implementation.
*Result: Users can ask questions in plain English and receive data charts.*

**Milestone 6: Alerts & Exporting (Low Complexity)**
- Worker queues, email integrations, CSV/PDF export workers.
*Result: Users can schedule reports and receive anomaly alerts.*

**Milestone 7: Production Release (Medium Complexity)**
- Penetration testing, load testing, final staging QA, marketing site launch.
*Result: Platform is live, secure, and ready for public signups.*

*(End of Architecture Document)*
