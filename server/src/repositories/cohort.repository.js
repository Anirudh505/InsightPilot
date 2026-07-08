import { Cohort } from '../models/cohort.model.js';
import { Event } from '../models/event.model.js';
import mongoose from 'mongoose';
import logger from '../config/logger.config.js';

class CohortRepository {
  async create(data) {
    const cohort = new Cohort(data);
    return await cohort.save();
  }

  async findById(id) {
    return await Cohort.findById(id).where({ deletedAt: null });
  }

  async findByProject(projectId) {
    return await Cohort.find({ project: projectId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    return await Cohort.findByIdAndUpdate(id, data, { new: true }).where({ deletedAt: null });
  }

  async updateCalculationResult(id, result) {
    return await Cohort.findByIdAndUpdate(id, { 
      lastResult: result, 
      calculationStatus: 'idle' 
    });
  }

  async setCalculationStatus(id, status) {
    return await Cohort.findByIdAndUpdate(id, { calculationStatus: status });
  }

  async softDelete(id) {
    return await Cohort.findByIdAndUpdate(id, { deletedAt: new Date(), isArchived: true });
  }

  /**
   * Translates cohort rules into a MongoDB query and extracts distinct users.
   */
  async calculateCohortUsers(cohortId) {
    const cohort = await this.findById(cohortId);
    if (!cohort || cohort.rules.length === 0) return null;

    const projectId = cohort.project;
    const now = new Date();
    
    // Simplification for prototype: we evaluate each rule and intersect the user lists.
    // In production, complex $and / $or dynamic aggregation pipelines would be generated.
    let masterUserList = null;

    for (const rule of cohort.rules) {
      let query = { project: new mongoose.Types.ObjectId(projectId) };
      
      // Timeframe constraint
      if (rule.timeframeDays) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - rule.timeframeDays);
        query.timestamp = { $gte: startDate, $lte: now };
      }

      if (rule.type === 'event') {
        query.event = rule.event;
      } else if (rule.type === 'property') {
        // Mapping standard context fields or generic properties
        const fieldMap = {
          'country': 'context.location.country',
          'browser': 'context.browser.name',
          'device': 'context.device.type',
          'platform': 'context.os.name',
          'utm_source': 'context.campaign.source'
        };
        const targetField = fieldMap[rule.property] || `properties.${rule.property}`;

        if (rule.operator === 'eq') query[targetField] = rule.value;
        if (rule.operator === 'neq') query[targetField] = { $ne: rule.value };
      }

      // Execute distinct query
      const usersForRule = await Event.distinct('anonymousId', query);
      const userSet = new Set(usersForRule);

      // Intersect with master list
      if (masterUserList === null) {
        masterUserList = userSet;
      } else {
        masterUserList = new Set([...masterUserList].filter(x => userSet.has(x)));
      }
    }

    const finalUsers = Array.from(masterUserList || []);
    
    return {
      calculatedAt: new Date(),
      userCount: finalUsers.length,
      users: finalUsers
    };
  }
}

export default new CohortRepository();
