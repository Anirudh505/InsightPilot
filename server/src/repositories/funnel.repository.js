import { Funnel } from '../models/funnel.model.js';
import { Event } from '../models/event.model.js';
import mongoose from 'mongoose';
import logger from '../config/logger.config.js';

class FunnelRepository {
  async create(data) {
    const funnel = new Funnel(data);
    return await funnel.save();
  }

  async findById(id) {
    return await Funnel.findById(id).where({ deletedAt: null });
  }

  async findByProject(projectId) {
    return await Funnel.find({ project: projectId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    return await Funnel.findByIdAndUpdate(id, data, { new: true }).where({ deletedAt: null });
  }

  async updateCalculationResult(id, result) {
    return await Funnel.findByIdAndUpdate(id, { 
      lastResult: result, 
      calculationStatus: 'idle' 
    });
  }

  async setCalculationStatus(id, status) {
    return await Funnel.findByIdAndUpdate(id, { calculationStatus: status });
  }

  async softDelete(id) {
    return await Funnel.findByIdAndUpdate(id, { deletedAt: new Date(), isArchived: true });
  }

  /**
   * The core Funnel calculation engine.
   * Processes millions of raw events sequentially to find conversions.
   */
  async calculateFunnelConversions(funnelId, startDate, endDate) {
    const funnel = await this.findById(funnelId);
    if (!funnel || funnel.steps.length === 0) return null;

    const projectId = funnel.project;
    const steps = funnel.steps.sort((a, b) => a.order - b.order);
    const firstStepName = steps[0].eventName;

    // Step 1: Find all distinct users who triggered the FIRST step of the funnel within the date range
    const firstStepUsersAgg = await Event.aggregate([
      { 
        $match: { 
          project: new mongoose.Types.ObjectId(projectId), 
          event: firstStepName,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$anonymousId", // Using anonymousId as primary identifier for unauthenticated funnels
          firstTimestamp: { $min: "$timestamp" } // Earliest time they entered the funnel
        }
      }
    ]);

    let startingUsersCount = firstStepUsersAgg.length;
    if (startingUsersCount === 0) {
      return this._buildEmptyResult(steps, startDate, endDate);
    }

    // Initialize result structure
    const stepResults = steps.map(s => ({
      order: s.order,
      eventName: s.eventName,
      usersCompleted: 0,
      dropOffPercentage: 0,
      medianTimeFromPreviousSeconds: 0
    }));

    // Everyone who started completed step 0
    stepResults[0].usersCompleted = startingUsersCount;

    let previousStepUsers = firstStepUsersAgg;

    // Evaluate subsequent steps sequentially
    for (let i = 1; i < steps.length; i++) {
      const targetEvent = steps[i].eventName;
      const conversionWindowMs = funnel.conversionWindowMinutes * 60 * 1000;
      
      const currentStepCompletedUsers = [];

      // For a massive dataset in production, we would use $facet or iterative map-reduce.
      // For this implementation, we query events that occurred AFTER the previous step for each user.
      // Since we want this to run asynchronously and safely, we process in chunks if needed, but Mongoose aggregation handles this well.
      
      const previousUsersMap = new Map(previousStepUsers.map(u => [u._id, u.firstTimestamp]));
      const userIds = Array.from(previousUsersMap.keys());

      const nextStepAgg = await Event.aggregate([
        {
          $match: {
            project: new mongoose.Types.ObjectId(projectId),
            event: targetEvent,
            anonymousId: { $in: userIds },
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
           // Sort by timestamp so we get the earliest conversion event
           $sort: { timestamp: 1 }
        },
        {
          $group: {
            _id: "$anonymousId",
            conversionTimestamp: { $min: "$timestamp" }
          }
        }
      ]);

      // Filter to ensure they converted AFTER the previous step AND within the conversion window
      for (const nextUser of nextStepAgg) {
        const prevTime = previousUsersMap.get(nextUser._id);
        if (nextUser.conversionTimestamp >= prevTime) {
          const timeDiff = nextUser.conversionTimestamp.getTime() - prevTime.getTime();
          if (timeDiff <= conversionWindowMs) {
            currentStepCompletedUsers.push({
              _id: nextUser._id,
              firstTimestamp: nextUser.conversionTimestamp,
              timeTaken: timeDiff / 1000 // seconds
            });
          }
        }
      }

      stepResults[i].usersCompleted = currentStepCompletedUsers.length;
      
      // Calculate Drop-off
      const prevCount = stepResults[i-1].usersCompleted;
      stepResults[i].dropOffPercentage = prevCount === 0 ? 100 : Number((((prevCount - currentStepCompletedUsers.length) / prevCount) * 100).toFixed(2));

      // Calculate Median Time
      if (currentStepCompletedUsers.length > 0) {
        const times = currentStepCompletedUsers.map(u => u.timeTaken).sort((a, b) => a - b);
        const mid = Math.floor(times.length / 2);
        stepResults[i].medianTimeFromPreviousSeconds = times.length % 2 !== 0 ? times[mid] : (times[mid - 1] + times[mid]) / 2;
      }

      previousStepUsers = currentStepCompletedUsers;
    }

    const finalCompleted = stepResults[steps.length - 1].usersCompleted;
    
    return {
      calculatedAt: new Date(),
      dateRange: { start: startDate, end: endDate },
      totalUsersStarted: startingUsersCount,
      totalUsersCompleted: finalCompleted,
      overallConversionRate: Number(((finalCompleted / startingUsersCount) * 100).toFixed(2)),
      overallMedianTimeSeconds: 0, // Simplified for now
      steps: stepResults
    };
  }

  _buildEmptyResult(steps, start, end) {
    return {
      calculatedAt: new Date(),
      dateRange: { start, end },
      totalUsersStarted: 0,
      totalUsersCompleted: 0,
      overallConversionRate: 0,
      overallMedianTimeSeconds: 0,
      steps: steps.map(s => ({
        order: s.order,
        eventName: s.eventName,
        usersCompleted: 0,
        dropOffPercentage: s.order === 1 ? 0 : 100,
        medianTimeFromPreviousSeconds: 0
      }))
    };
  }
}

export default new FunnelRepository();
