import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/insightpilot',
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  cloudinaryUrl: process.env.CLOUDINARY_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  aiBaseUrl: process.env.AI_BASE_URL,
  aiModel: process.env.AI_MODEL,
  redisUrl: process.env.REDIS_URL
};
