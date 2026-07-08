import { env } from './env.config.js';

const corsOptions = {
  origin: env.nodeEnv === 'production' ? env.clientUrl : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

export default corsOptions;
