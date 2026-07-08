import funnelRepository from '../repositories/funnel.repository.js';
import funnelJob from '../jobs/funnel.job.js';
import { NotFoundError, BadRequestError } from '../utils/ApiError.js';

class FunnelService {
  async createFunnel(projectId, workspaceId, userId, data) {
    if (!data.steps || data.steps.length < 2) {
      throw new BadRequestError('A funnel must have at least 2 steps');
    }

    const funnel = await funnelRepository.create({
      ...data,
      project: projectId,
      workspace: workspaceId,
      createdBy: userId
    });

    return funnel;
  }

  async getFunnels(projectId) {
    return await funnelRepository.findByProject(projectId);
  }

  async getFunnelById(id, projectId) {
    const funnel = await funnelRepository.findById(id);
    if (!funnel || funnel.project.toString() !== projectId.toString()) {
      throw new NotFoundError('Funnel not found');
    }
    return funnel;
  }

  async updateFunnel(id, projectId, data) {
    const funnel = await this.getFunnelById(id, projectId);
    
    // If steps change, invalidate the last result
    if (data.steps) {
      data.lastResult = null;
      data.calculationStatus = 'idle';
    }

    return await funnelRepository.updateById(id, data);
  }

  async deleteFunnel(id, projectId) {
    const funnel = await this.getFunnelById(id, projectId);
    return await funnelRepository.softDelete(id);
  }

  /**
   * Triggers the asynchronous calculation of the funnel
   */
  async calculateFunnel(id, projectId, startDate, endDate) {
    const funnel = await this.getFunnelById(id, projectId);
    
    if (funnel.calculationStatus === 'calculating') {
      throw new BadRequestError('Funnel calculation is already in progress');
    }

    // Hand off to the job processor
    await funnelJob.triggerCalculation(id, startDate, endDate);
    
    return {
      message: 'Funnel calculation queued. Check back for results.',
      status: 'calculating'
    };
  }
}

export default new FunnelService();
