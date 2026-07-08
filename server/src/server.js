import app from './app.js';
import { env } from './config/env.config.js';
import logger from './config/logger.config.js';
import connectDB from './config/db.config.js';
import { initializeJobs } from './jobs/aggregation.job.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express App
    const server = app.listen(env.port, () => {
      logger.info(`Server is running on http://localhost:${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
      logger.info(`Swagger Docs available at http://localhost:${env.port}/api-docs`);
    });

    // Initialize Background Jobs
    initializeJobs();

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(err.stack);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle Uncaught Exceptions
    process.on('uncaughtException', (err) => {
      logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      logger.error(err.stack);
      process.exit(1);
    });

    // Handle SIGTERM (e.g., from Docker/Railway/Render)
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully...');
      server.close(() => {
        logger.info('💥 Process terminated!');
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
