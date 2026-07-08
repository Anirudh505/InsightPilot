import winston from 'winston';
import { env } from './env.config.js';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Configure transports
const transports = [
  // Console transport for development
  new winston.transports.Console({
    level: env.nodeEnv === 'development' ? 'debug' : 'info',
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat
    )
  }),
  // Error log file
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: combine(
      timestamp(),
      errors({ stack: true }),
      winston.format.json()
    )
  }),
  // Combined log file
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    format: combine(
      timestamp(),
      winston.format.json()
    )
  })
];

const logger = winston.createLogger({
  level: env.nodeEnv === 'development' ? 'debug' : 'info',
  transports
});

export default logger;
