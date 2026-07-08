import { RetentionSnapshot } from '../models/retentionSnapshot.model.js';
import { Event } from '../models/event.model.js';
import mongoose from 'mongoose';
import logger from '../config/logger.config.js';

class RetentionRepository {
  /**
   * Calculates the N-Day classical retention matrix for a given cohort Date (Day 0)
   * This computes how many users from Day 0 returned on Day 1, Day 3, Day 7, etc.
   */
  async calculateDailyRetention(projectId, workspaceId, cohortDate, startEvent = 'Any Event', returnEvent = 'Any Event') {
    // Determine the precise boundaries of Day 0
    const dayZeroStart = new Date(cohortDate);
    dayZeroStart.setUTCHours(0, 0, 0, 0);
    const dayZeroEnd = new Date(dayZeroStart);
    dayZeroEnd.setUTCDate(dayZeroEnd.getUTCDate() + 1); // 24 hours later

    // Step 1: Find users who performed the Start Event on Day 0
    const startQuery = {
      project: new mongoose.Types.ObjectId(projectId),
      timestamp: { $gte: dayZeroStart, $lt: dayZeroEnd }
    };
    if (startEvent !== 'Any Event') {
      startQuery.event = startEvent;
    }

    const cohortUsers = await Event.distinct('anonymousId', startQuery);
    const cohortSize = cohortUsers.length;

    if (cohortSize === 0) {
      return this._saveSnapshot(projectId, workspaceId, dayZeroStart, startEvent, returnEvent, 0, {});
    }

    // Target retention windows (days after Day 0)
    const retentionDays = [1, 2, 3, 4, 5, 6, 7, 14, 30, 60, 90];
    const retentionMatrix = {};
    const now = new Date();

    // Step 2: Iterate over each retention day and query if those users returned
    // This is mathematically expensive, hence running it sequentially in a background job is perfect.
    for (const dayOffset of retentionDays) {
      const targetStart = new Date(dayZeroStart);
      targetStart.setUTCDate(targetStart.getUTCDate() + dayOffset);
      
      const targetEnd = new Date(targetStart);
      targetEnd.setUTCDate(targetEnd.getUTCDate() + 1);

      // If the target day hasn't happened yet, break out.
      if (targetStart > now) break;

      const returnQuery = {
        project: new mongoose.Types.ObjectId(projectId),
        anonymousId: { $in: cohortUsers },
        timestamp: { $gte: targetStart, $lt: targetEnd }
      };
      
      if (returnEvent !== 'Any Event') {
        returnQuery.event = returnEvent;
      }

      // We just need the count of distinct returning users
      const returningUsers = await Event.distinct('anonymousId', returnQuery);
      retentionMatrix[dayOffset.toString()] = returningUsers.length;
    }

    return await this._saveSnapshot(projectId, workspaceId, dayZeroStart, startEvent, returnEvent, cohortSize, retentionMatrix);
  }

  async _saveSnapshot(projectId, workspaceId, cohortDate, startEvent, returnEvent, cohortSize, retentionMatrix) {
    return await RetentionSnapshot.findOneAndUpdate(
      { project: projectId, cohortDate, startEvent, returnEvent },
      { 
        $set: { 
          workspace: workspaceId,
          cohortSize,
          retentionMatrix,
          generatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );
  }

  // API QUERY LAYER
  async getRetentionHeatmap(projectId, startDate, endDate, startEvent = 'Any Event', returnEvent = 'Any Event') {
    return await RetentionSnapshot.find({
      project: projectId,
      startEvent,
      returnEvent,
      cohortDate: { $gte: startDate, $lte: endDate }
    }).sort({ cohortDate: 1 });
  }
}

export default new RetentionRepository();
