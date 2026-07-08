import express from 'express';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifications management
 */

// Placeholder route
router.get('/', (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Notifications route placeholder'));
});

export default router;
