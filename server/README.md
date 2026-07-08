# InsightPilot Backend

This repository contains the Node.js / Express backend foundation for the InsightPilot platform. It acts as the central API gateway and analytics processor.

## Stack
- **Node.js** (v20+)
- **Express.js** (API Framework)
- **MongoDB & Mongoose** (Database & ORM)
- **Winston & Morgan** (Logging)
- **Jest** (Testing)
- **Swagger / OpenAPI** (Documentation)

## Folder Structure

Following Clean Architecture principles:

```text
server/
├── src/
│   ├── config/        # Environment, DB, Logger, CORS setup
│   ├── constants/     # Global constants and enums
│   ├── controllers/   # Request handlers (keep thin)
│   ├── services/      # Core business logic
│   ├── repositories/  # Database abstractions (Mongoose operations)
│   ├── routes/        # Express route definitions
│   ├── middleware/    # Auth, Validation, Error handling
│   ├── models/        # Mongoose schemas
│   ├── validators/    # express-validator schemas
│   ├── utils/         # Reusable helpers (ApiError, AsyncHandler)
│   ├── helpers/       # Domain-specific helpers
│   ├── database/      # Seeders and raw DB scripts
│   ├── docs/          # Swagger documentation
│   ├── logs/          # Generated log files (ignored by git)
│   ├── sockets/       # Socket.IO handlers (Future)
│   ├── jobs/          # Background job processors (Future)
│   ├── events/        # Event emitters/listeners
│   ├── cron/          # Scheduled cron jobs
│   ├── uploads/       # Temporary file uploads
│   ├── app.js         # Express App setup & middleware
│   └── server.js      # Entry point (Server & DB connection)
├── tests/             # Jest tests
├── .env.example       # Example environment variables
├── package.json       # Dependencies and scripts
├── Dockerfile         # Production Docker setup
└── README.md
```

## Setup & Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy the example file and update with your local configuration:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure MongoDB is running locally on port 27017 or provide a MongoDB Atlas URI.*

3. **Running Locally:**
   Start the development server with hot-reloading (nodemon):
   ```bash
   npm run dev
   ```
   Start the production server:
   ```bash
   npm run start
   ```

## Scripts

- `npm run dev`: Starts server in dev mode with nodemon.
- `npm run start`: Starts server in prod mode.
- `npm run lint`: Runs ESLint for code formatting.
- `npm run test`: Runs the Jest test suite.

## API Documentation

Once the server is running, the interactive Swagger documentation is available at:
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Deployment

The backend includes a `Dockerfile` and is deployment-ready for platforms like **Railway**, **Render**, or **AWS ECS**.

1. Connect your GitHub repository to Railway/Render.
2. Set the Environment Variables in the platform's dashboard.
3. The platform will automatically build the Docker image and deploy.
