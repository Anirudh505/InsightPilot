import express from 'express';
import mongoose from 'mongoose';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

// Liveness check
router.get('/live', (req, res) => {
  res.status(200).json(new ApiResponse(200, { status: 'UP' }, 'Liveness check passed'));
});

// Readiness check (including DB)
router.get('/ready', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  
  if (isDbConnected) {
    res.status(200).json(new ApiResponse(200, { 
      status: 'UP', 
      db: 'Connected' 
    }, 'Readiness check passed'));
  } else {
    res.status(503).json(new ApiResponse(503, { 
      status: 'DOWN', 
      db: 'Disconnected' 
    }, 'Service Unavailable'));
  }
});

// Detailed health check
router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    memoryUsage: process.memoryUsage(),
  };

  res.status(200).json(new ApiResponse(200, healthCheck, 'Health check passed'));
});

export default router;
