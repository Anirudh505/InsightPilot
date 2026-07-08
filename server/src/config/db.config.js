import mongoose from 'mongoose';
import logger from './logger.config.js';
import { env } from './env.config.js';

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      mongoose.set('strictQuery', false);
      const conn = await mongoose.connect(env.mongodbUri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10, // Maintain up to 10 socket connections
      });
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (err) {
      logger.error(`MongoDB Connection Error: ${err.message}`);
      retries -= 1;
      logger.info(`Retries left: ${retries}`);
      if (retries === 0) {
        logger.error('Failed to connect to MongoDB after 5 attempts.');
        process.exit(1); // Exit with failure
      }
      // Wait for 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

// Graceful shutdown
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
