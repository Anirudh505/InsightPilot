import cohortRepository from '../repositories/cohort.repository.js';
import cohortJob from '../jobs/cohort.job.js';
import { NotFoundError, BadRequestError } from '../utils/ApiError.js';

class CohortService {
  async createCohort(projectId, workspaceId, userId, data) {
    if (!data.rules || data.rules.length === 0) {
      throw new BadRequestError('A cohort must have at least 1 rule');
    }

    const cohort = await cohortRepository.create({
      ...data,
      project: projectId,
      workspace: workspaceId,
      createdBy: userId
    });

    return cohort;
  }

  async getCohorts(projectId) {
    return await cohortRepository.findByProject(projectId);
  }

  async getCohortById(id, projectId) {
    const cohort = await cohortRepository.findById(id);
    if (!cohort || cohort.project.toString() !== projectId.toString()) {
      throw new NotFoundError('Cohort not found');
    }
    return cohort;
  }

  async updateCohort(id, projectId, data) {
    const cohort = await this.getCohortById(id, projectId);
    
    if (data.rules) {
      data.lastResult = null;
      data.calculationStatus = 'idle';
    }

    return await cohortRepository.updateById(id, data);
  }

  async deleteCohort(id, projectId) {
    const cohort = await this.getCohortById(id, projectId);
    return await cohortRepository.softDelete(id);
  }

  async calculateCohort(id, projectId) {
    const cohort = await this.getCohortById(id, projectId);
    
    if (cohort.calculationStatus === 'calculating') {
      throw new BadRequestError('Cohort calculation is already in progress');
    }

    await cohortJob.triggerCalculation(id);
    
    return {
      message: 'Cohort calculation queued. Check back for results.',
      status: 'calculating'
    };
  }
}

export default new CohortService();
