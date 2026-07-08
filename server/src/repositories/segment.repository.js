import { Segment } from '../models/segment.model.js';
import { Event } from '../models/event.model.js';
import mongoose from 'mongoose';

class SegmentRepository {
  async create(data) {
    const segment = new Segment(data);
    return await segment.save();
  }

  async findById(id) {
    return await Segment.findById(id).where({ deletedAt: null });
  }

  async findByProject(projectId) {
    return await Segment.find({ project: projectId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    return await Segment.findByIdAndUpdate(id, data, { new: true }).where({ deletedAt: null });
  }

  async updateCalculationResult(id, result) {
    return await Segment.findByIdAndUpdate(id, { 
      lastResult: result, 
      calculationStatus: 'idle' 
    });
  }

  async setCalculationStatus(id, status) {
    return await Segment.findByIdAndUpdate(id, { calculationStatus: status });
  }

  async softDelete(id) {
    return await Segment.findByIdAndUpdate(id, { deletedAt: new Date(), isArchived: true });
  }

  /**
   * Calculates users who match the segment definition.
   * Handles AND / OR logic between rules.
   */
  async calculateSegmentUsers(segmentId) {
    const segment = await this.findById(segmentId);
    if (!segment || segment.rules.length === 0) return null;

    const projectId = segment.project;
    const now = new Date();
    
    let masterUserList = null; // Used for AND logic
    let orUserList = new Set(); // Used for OR logic

    for (const rule of segment.rules) {
      let query = { project: new mongoose.Types.ObjectId(projectId) };
      
      if (rule.timeframeDays) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - rule.timeframeDays);
        query.timestamp = { $gte: startDate, $lte: now };
      }

      if (rule.type === 'event') {
        query.event = rule.key;
      } else if (rule.type === 'property') {
        const targetField = `properties.${rule.key}`;
        if (rule.operator === 'eq') query[targetField] = rule.value;
      }

      const usersForRule = await Event.distinct('anonymousId', query);
      const userSet = new Set(usersForRule);

      if (segment.logicOperator === 'OR') {
        userSet.forEach(u => orUserList.add(u));
      } else {
        // logicOperator === 'AND'
        if (masterUserList === null) {
          masterUserList = userSet;
        } else {
          masterUserList = new Set([...masterUserList].filter(x => userSet.has(x)));
        }
      }
    }

    const finalUsers = segment.logicOperator === 'OR' 
      ? Array.from(orUserList) 
      : Array.from(masterUserList || []);
    
    return {
      calculatedAt: new Date(),
      userCount: finalUsers.length,
      users: finalUsers
    };
  }
}

export default new SegmentRepository();
