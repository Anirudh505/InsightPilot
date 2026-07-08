import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.config.js';
import corsOptions from './config/cors.config.js';
import swaggerSpec from './config/swagger.config.js';
import logger from './config/logger.config.js';

import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

// ==========================================
// Security & Middleware
// ==========================================

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors(corsOptions));

// Compress response bodies
app.use(compression());

// Parse JSON request body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies
app.use(cookieParser());

// Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ==========================================
// Logging
// ==========================================

// HTTP request logger middleware
const morganFormat = env.nodeEnv === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ==========================================
// Documentation
// ==========================================

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================
// API Routes
// ==========================================

// Mount all routes under /api/v1
app.use('/api/v1', routes);

// ==========================================
// Error Handling
// ==========================================

// Handle 404 - Not Found
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
