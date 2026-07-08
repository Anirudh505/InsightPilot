import { UserJourney } from '../models/journey.model.js';
import mongoose from 'mongoose';

class LifecycleService {
  /**
   * Computes high-level lifecycle macro metrics for the project
   */
  async getLifecycleOverview(projectId) {
    const now = new Date();
    
    // Users active in last 30 days
    const activeThreshold = new Date(now);
    activeThreshold.setUTCDate(activeThreshold.getUTCDate() - 30);

    // Users who were active before 30 days ago, but not since (Dormant/Churned)
    const dormantThreshold = new Date(now);
    dormantThreshold.setUTCDate(dormantThreshold.getUTCDate() - 90);

    const agg = await UserJourney.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(projectId) } },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { 
            $sum: { $cond: [{ $gte: ["$lastSeenAt", activeThreshold] }, 1, 0] } 
          },
          dormantUsers: {
            $sum: { 
              $cond: [
                { $and: [
                    { $lt: ["$lastSeenAt", activeThreshold] }, 
                    { $gte: ["$lastSeenAt", dormantThreshold] }
                  ] 
                }, 1, 0
              ] 
            }
          },
          churnedUsers: {
            $sum: { $cond: [{ $lt: ["$lastSeenAt", dormantThreshold] }, 1, 0] } 
          }
        }
      }
    ]);

    return agg[0] || {
      totalUsers: 0,
      activeUsers: 0,
      dormantUsers: 0,
      churnedUsers: 0
    };
  }
}

export default new LifecycleService();
