import apiKeyRepository from '../repositories/apiKey.repository.js';
import projectRepository from '../repositories/project.repository.js';
import { UnauthorizedError, ForbiddenError } from '../utils/ApiError.js';
import AsyncHandler from '../utils/AsyncHandler.js';
import logger from '../config/logger.config.js';

/**
 * Middleware to authenticate SDK requests via Project Public Key
 */
export const authenticateSdkRequest = AsyncHandler(async (req, res, next) => {
  // Check headers or query params for the public key
  const publicKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!publicKey) {
    logger.warn(`SDK Auth failed: No API key provided from IP ${req.ip}`);
    throw new UnauthorizedError('API key is required');
  }

  // Validate format
  if (!publicKey.startsWith('pk_')) {
    throw new UnauthorizedError('Invalid API key format');
  }

  // Find the key (Note: public keys are not hashed, so we can search directly)
  const apiKey = await apiKeyRepository.findByPublicKey(publicKey);
  
  if (!apiKey || apiKey.status !== 'active') {
    throw new UnauthorizedError('Invalid or revoked API key');
  }

  if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
    throw new UnauthorizedError('API key has expired');
  }

  // Ensure the project itself is active
  const project = await projectRepository.findById(apiKey.project._id);
  
  if (!project || project.status !== 'active') {
    throw new ForbiddenError('Project is not active');
  }

  // We don't hash/compare secret keys here because SDK ingestion is client-side.
  // The Public Key alone is enough to route the events to the correct project.
  // Rate limiting (configured elsewhere) prevents spam.

  // Attach context to request
  req.project = project;
  req.workspaceId = project.workspace;
  
  // Fire and forget usage recording (Optional: might be heavy for high throughput, could batch this)
  apiKeyRepository.recordUsage(apiKey._id).catch(err => logger.error('Failed to record API key usage', err));

  next();
});
