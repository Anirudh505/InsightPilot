import express from 'express';
import trackingController from '../controllers/tracking.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { trackEventValidator, batchTrackValidator } from '../validators/tracking.validator.js';
import { authenticateSdkRequest } from '../middleware/sdkAuth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ingestion (SDK)
 *   description: High-throughput SDK event collection endpoints
 */

// All SDK ingestion routes require the Project Public Key
router.use(authenticateSdkRequest);

/**
 * @swagger
 * /events/collect:
 *   post:
 *     summary: Ingest a single telemetry event
 *     tags: [Ingestion (SDK)]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Project Public Key (pk_...)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - anonymousId
 *               - event
 *               - type
 *             properties:
 *               anonymousId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               event:
 *                 type: string
 *                 example: "Button Clicked"
 *               type:
 *                 type: string
 *                 enum: [track, page, identify]
 *                 example: "track"
 *               properties:
 *                 type: object
 *               context:
 *                 type: object
 *     responses:
 *       200:
 *         description: Event ingested
 *       401:
 *         description: Invalid API Key
 */
router.post('/collect', trackEventValidator, validate, trackingController.collect);

/**
 * @swagger
 * /events/batch:
 *   post:
 *     summary: Ingest a batch of telemetry events
 *     tags: [Ingestion (SDK)]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Batch ingested
 */
router.post('/batch', batchTrackValidator, validate, trackingController.batch);

export default router;
