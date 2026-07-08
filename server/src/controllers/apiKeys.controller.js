import AsyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import apiKeyService from '../services/apiKey.service.js';

class ApiKeyController {
  generateKey = AsyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const keyData = await apiKeyService.generateKey(projectId, req.user._id, req.body);
    // Remember to only show secret key ONCE
    res.status(201).json(new ApiResponse(201, keyData, 'API Key generated successfully. Save the secret key, it will not be shown again.'));
  });

  getProjectKeys = AsyncHandler(async (req, res) => {
    const keys = await apiKeyService.getProjectKeys(req.params.projectId);
    res.status(200).json(new ApiResponse(200, keys, 'Project API keys fetched'));
  });

  revokeKey = AsyncHandler(async (req, res) => {
    await apiKeyService.revokeKey(req.params.keyId, req.params.projectId);
    res.status(200).json(new ApiResponse(200, null, 'API Key revoked successfully'));
  });
}

export default new ApiKeyController();
