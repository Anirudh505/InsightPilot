import { ConversionGoal } from '../models/goal.model.js';

class GoalRepository {
  async create(data) {
    const goal = new ConversionGoal(data);
    return await goal.save();
  }

  async findById(id) {
    return await ConversionGoal.findById(id).where({ deletedAt: null });
  }

  async findByProject(projectId) {
    return await ConversionGoal.find({ project: projectId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    return await ConversionGoal.findByIdAndUpdate(id, data, { new: true }).where({ deletedAt: null });
  }

  async softDelete(id) {
    return await ConversionGoal.findByIdAndUpdate(id, { deletedAt: new Date(), isArchived: true });
  }
}

export default new GoalRepository();
