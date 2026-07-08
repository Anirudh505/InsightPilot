import { Event } from '../models/event.model.js';
import mongoose from 'mongoose';

class RealtimeService {
  /**
   * Calculates live stats by querying events strictly within the last 15 minutes.
   * This endpoint is designed to be polled rapidly by the frontend.
   */
  async getRealtimeOverview(projectId) {
    const now = new Date();
    const fifteenMinsAgo = new Date(now.getTime() - (15 * 60 * 1000));
    
    // In a massive scale production system, this would pull from Redis.
    // For this implementation, an indexed MongoDB query over a 15-minute window is extremely fast.
    const agg = await Event.aggregate([
      { 
        $match: { 
          project: new mongoose.Types.ObjectId(projectId),
          timestamp: { $gte: fifteenMinsAgo, $lte: now }
        }
      },
      {
        $group: {
          _id: null,
          liveUsers: { $addToSet: "$anonymousId" },
          eventsPerMinute: { $sum: 1 }
        }
      }
    ]);

    const result = agg[0] || { liveUsers: [], eventsPerMinute: 0 };
    
    return {
      activeUsersRightNow: result.liveUsers.length,
      eventsPerMinute: Number((result.eventsPerMinute / 15).toFixed(2)),
      timestamp: now
    };
  }
}

export default new RealtimeService();
