import { Event } from '../models/event.model.js';
import { Session } from '../models/session.model.js';
import { HourlyAnalytics } from '../models/hourlyAnalytics.model.js';
import { DailyAnalytics } from '../models/dailyAnalytics.model.js';
import mongoose from 'mongoose';

class AnalyticsRepository {
  /**
   * Aggregates raw events into an hourly summary.
   * This runs via chron job.
   */
  async buildHourlyAggregation(projectId, startOfHour, endOfHour) {
    // 1. Calculate event counts and distributions
    const eventAgg = await Event.aggregate([
      { 
        $match: { 
          project: new mongoose.Types.ObjectId(projectId), 
          timestamp: { $gte: startOfHour, $lt: endOfHour } 
        } 
      },
      { 
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          pageViews: { $sum: { $cond: [{ $eq: ["$type", "page"] }, 1, 0] } },
          uniqueUsers: { $addToSet: "$userId" },
          uniqueAnon: { $addToSet: "$anonymousId" }
        }
      }
    ]);

    // Calculate Maps (Events distribution)
    const eventDist = await Event.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId), timestamp: { $gte: startOfHour, $lt: endOfHour } } },
      { $group: { _id: "$event", count: { $sum: 1 } } }
    ]);

    // 2. Calculate Sessions for this hour
    const sessionAgg = await Session.aggregate([
      { 
        $match: { 
          project: new mongoose.Types.ObjectId(projectId), 
          startedAt: { $gte: startOfHour, $lt: endOfHour } 
        } 
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          bounces: { $sum: { $cond: ["$isBounce", 1, 0] } }
        }
      }
    ]);

    const result = {
      totalEvents: eventAgg[0]?.totalEvents || 0,
      pageViews: eventAgg[0]?.pageViews || 0,
      totalSessions: sessionAgg[0]?.totalSessions || 0,
      bounces: sessionAgg[0]?.bounces || 0,
      activeUsers: (eventAgg[0]?.uniqueUsers || []).filter(Boolean),
      activeAnonymous: (eventAgg[0]?.uniqueAnon || []).filter(Boolean),
      events: eventDist.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
    };

    return result;
  }

  /**
   * Aggregates Hourly Analytics into a Daily Summary.
   */
  async buildDailyAggregation(projectId, startOfDay, endOfDay) {
    const hourlyData = await HourlyAnalytics.find({
      project: projectId,
      hour: { $gte: startOfDay, $lt: endOfDay }
    });

    if (!hourlyData.length) return null;

    const result = {
      totalEvents: 0,
      totalSessions: 0,
      pageViews: 0,
      bounces: 0,
      events: {}
    };

    const uniqueUsers = new Set();
    const uniqueAnon = new Set();

    hourlyData.forEach(hour => {
      result.totalEvents += hour.totalEvents;
      result.totalSessions += hour.totalSessions;
      result.pageViews += hour.pageViews;
      result.bounces += hour.bounces;

      hour.activeUsers.forEach(u => uniqueUsers.add(u));
      hour.activeAnonymous.forEach(u => uniqueAnon.add(u));

      if (hour.events) {
        hour.events.forEach((val, key) => {
          result.events[key] = (result.events[key] || 0) + val;
        });
      }
    });

    result.dau = uniqueUsers.size > 0 ? uniqueUsers.size : uniqueAnon.size;
    result.bounceRate = result.totalSessions > 0 ? (result.bounces / result.totalSessions) * 100 : 0;
    
    // Average session duration needs to be calculated from raw sessions for accuracy
    const durationAgg = await Session.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId), startedAt: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, avgDuration: { $avg: "$durationSeconds" } } }
    ]);
    result.avgSessionDuration = durationAgg[0]?.avgDuration || 0;

    return result;
  }

  async saveHourlyAnalytics(projectId, workspaceId, hour, data) {
    return await HourlyAnalytics.findOneAndUpdate(
      { project: projectId, hour },
      { $set: { ...data, workspace: workspaceId, lastAggregatedAt: new Date() } },
      { upsert: true, new: true }
    );
  }

  async saveDailyAnalytics(projectId, workspaceId, day, data) {
    return await DailyAnalytics.findOneAndUpdate(
      { project: projectId, day },
      { $set: { ...data, workspace: workspaceId, lastAggregatedAt: new Date() } },
      { upsert: true, new: true }
    );
  }

  // --- QUERY APIS FOR CONTROLLER --- //

  async getDailyTrends(projectId, startDate, endDate) {
    return await DailyAnalytics.find({
      project: projectId,
      day: { $gte: startDate, $lte: endDate }
    }).sort({ day: 1 });
  }

  async getAggregateSummary(projectId, startDate, endDate) {
    const agg = await DailyAnalytics.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId), day: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: "$totalEvents" },
          totalSessions: { $sum: "$totalSessions" },
          pageViews: { $sum: "$pageViews" },
          avgBounceRate: { $avg: "$bounceRate" },
          avgSessionDuration: { $avg: "$avgSessionDuration" }
        }
      }
    ]);
    return agg[0] || { totalEvents: 0, totalSessions: 0, pageViews: 0, avgBounceRate: 0, avgSessionDuration: 0 };
  }
}

export default new AnalyticsRepository();
