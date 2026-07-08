import crypto from 'crypto';
import bcrypt from 'bcrypt';
import apiKeyRepository from '../repositories/apiKey.repository.js';
import projectRepository from '../repositories/project.repository.js';
import { NotFoundError, BadRequestError } from '../utils/ApiError.js';

class ApiKeyService {
  async generateKey(projectId, userId, keyData) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Generate prefix (public) and secret part
    const prefix = crypto.randomBytes(8).toString('hex');
    const secretPart = crypto.randomBytes(32).toString('hex');
    const fullSecretKey = `ip_${prefix}_${secretPart}`;
    const publicKey = `pk_${prefix}`;

    // Hash secret key for DB storage
    const salt = await bcrypt.genSalt(10);
    const secretHash = await bcrypt.hash(fullSecretKey, salt);

    const apiKey = await apiKeyRepository.create({
      ...keyData,
      project: projectId,
      publicKey,
      secretHash,
      createdBy: userId,
    });

    // Return the plaintext secret key ONLY ONCE during creation
    const responseObj = apiKey.toObject();
    delete responseObj.secretHash;
    
    return { ...responseObj, secretKey: fullSecretKey };
  }

  async getProjectKeys(projectId) {
    const keys = await apiKeyRepository.findByProject(projectId);
    // Remove secret hash from response list
    return keys.map(k => {
      const obj = k.toObject();
      delete obj.secretHash;
      return obj;
    });
  }

  async revokeKey(keyId, projectId) {
    const key = await apiKeyRepository.findByIdAndProject(keyId, projectId);
    if (!key) {
      throw new NotFoundError('API Key not found');
    }
    if (key.status === 'revoked') {
      throw new BadRequestError('API Key is already revoked');
    }
    return await apiKeyRepository.revoke(keyId);
  }

  // Used by SDK/Middleware to validate API requests
  async validateApiKey(publicKey, secretKey) {
    const apiKey = await apiKeyRepository.findByPublicKey(publicKey);
    if (!apiKey) return false;

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return false; // Expired
    }

    const isMatch = await bcrypt.compare(secretKey, apiKey.secretHash);
    if (isMatch) {
      // Asynchronously record usage (fire and forget for performance)
      apiKeyRepository.recordUsage(apiKey._id).catch(err => console.error(err));
      return apiKey.project;
    }
    return false;
  }
}

export default new ApiKeyService();
