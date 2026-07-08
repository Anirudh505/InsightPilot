import segmentRepository from '../repositories/segment.repository.js';
import segmentJob from '../jobs/segment.job.js';
import { NotFoundError, BadRequestError } from '../utils/ApiError.js';

class SegmentationService {
  async createSegment(projectId, workspaceId, userId, data) {
    if (!data.rules || data.rules.length === 0) {
      throw new BadRequestError('A segment must have at least 1 rule');
    }

    return await segmentRepository.create({
      ...data,
      project: projectId,
      workspace: workspaceId,
      createdBy: userId
    });
  }

  async getSegments(projectId) {
    return await segmentRepository.findByProject(projectId);
  }

  async getSegmentById(id, projectId) {
    const segment = await segmentRepository.findById(id);
    if (!segment || segment.project.toString() !== projectId.toString()) {
      throw new NotFoundError('Segment not found');
    }
    return segment;
  }

  async updateSegment(id, projectId, data) {
    const segment = await this.getSegmentById(id, projectId);
    
    if (data.rules || data.logicOperator) {
      data.lastResult = null;
      data.calculationStatus = 'idle';
    }

    return await segmentRepository.updateById(id, data);
  }

  async deleteSegment(id, projectId) {
    await this.getSegmentById(id, projectId);
    return await segmentRepository.softDelete(id);
  }

  async calculateSegment(id, projectId) {
    const segment = await this.getSegmentById(id, projectId);
    
    if (segment.calculationStatus === 'calculating') {
      throw new BadRequestError('Segment calculation is already in progress');
    }

    await segmentJob.triggerCalculation(id);
    
    return {
      message: 'Segment calculation queued. Check back for results.',
      status: 'calculating'
    };
  }
}

export default new SegmentationService();
