import { Feature } from '../models/feature.model.js';
import { FeatureAdoptionSnapshot } from '../models/featureAdoptionSnapshot.model.js';
import { Event } from '../models/event.model.js';
import { DailyAnalytics } from '../models/dailyAnalytics.model.js';
import mongoose from 'mongoose';

class FeatureRepository {
  async create(data) {
    const feature = new Feature(data);
    return await feature.save();
  }

  async findById(id) {
    return await Feature.findById(id).where({ deletedAt: null });
  }

  async findByProject(projectId) {
    return await Feature.find({ project: projectId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    return await Feature.findByIdAndUpdate(id, data, { new: true }).where({ deletedAt: null });
  }

  async softDelete(id) {
    return await Feature.findByIdAndUpdate(id, { deletedAt: new Date(), isArchived: true });
  }

  /**
   * Calculates feature adoption for a specific day by comparing feature usage
   * against the total project active users for that day.
   */
  async calculateDailyFeatureAdoption(featureId, targetDate) {
    const feature = await this.findById(featureId);
    if (!feature) return null;

    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const projectId = feature.project;

    // 1. Get overall Project DAU for the day (reuse Sprint 6 logic)
    const dailyAnalytics = await DailyAnalytics.findOne({ project: projectId, day: startOfDay });
    const projectDAU = dailyAnalytics ? dailyAnalytics.dau : 0;

    // 2. Query raw events to get feature DAU
    const featureQuery = {
      project: new mongoose.Types.ObjectId(projectId),
      event: feature.triggerEvent,
      timestamp: { $gte: startOfDay, $lt: endOfDay }
    };
    
    // Apply optional feature filters
    if (feature.filters && feature.filters.length > 0) {
      feature.filters.forEach(f => {
        const fieldName = `properties.${f.property}`;
        if (f.operator === 'eq') featureQuery[fieldName] = f.value;
      });
    }

    const featureAgg = await Event.aggregate([
      { $match: featureQuery },
      { 
        $group: {
          _id: null,
          totalInvocations: { $sum: 1 },
          uniqueUsers: { $addToSet: "$anonymousId" }
        }
      }
    ]);

    const activeUsers = featureAgg.length > 0 ? featureAgg[0].uniqueUsers.length : 0;
    const totalInvocations = featureAgg.length > 0 ? featureAgg[0].totalInvocations : 0;
    
    // Adoption Rate = (Feature DAU / Project DAU) * 100
    // If Project DAU is 0 but Feature DAU > 0, it means the DailyAnalytics hasn't finished yet, so default to 100% or 0.
    let adoptionRate = 0;
    if (projectDAU > 0) {
      adoptionRate = Number(((activeUsers / projectDAU) * 100).toFixed(2));
    } else if (activeUsers > 0) {
      adoptionRate = 100;
    }

    const avgInvocations = activeUsers > 0 ? Number((totalInvocations / activeUsers).toFixed(2)) : 0;

    return await FeatureAdoptionSnapshot.findOneAndUpdate(
      { feature: featureId, day: startOfDay },
      {
        $set: {
          project: projectId,
          activeUsers,
          projectActiveUsers: projectDAU,
          adoptionRate,
          totalInvocations,
          averageInvocationsPerUser: avgInvocations,
          generatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );
  }

  async getAdoptionSnapshots(featureId, startDate, endDate) {
    return await FeatureAdoptionSnapshot.find({
      feature: featureId,
      day: { $gte: startDate, $lte: endDate }
    }).sort({ day: 1 });
  }
}

export default new FeatureRepository();
