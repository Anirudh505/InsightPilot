import { UserJourney } from '../models/journey.model.js';
import { Event } from '../models/event.model.js';
import mongoose from 'mongoose';

class JourneyRepository {
  
  /**
   * Links a new anonymous session to a known User Journey
   * Or creates a new journey if it doesn't exist
   */
  async mapAnonymousToUser(projectId, anonymousId, userId) {
    if (!userId) return null;

    let journey = await UserJourney.findOne({ project: projectId, userId });
    
    if (journey) {
      // Add anonymousId to their journey if not already present
      if (!journey.anonymousIds.includes(anonymousId)) {
         journey.anonymousIds.push(anonymousId);
         journey.lastSeenAt = new Date();
         await journey.save();
      }
    } else {
      // Create new journey
      journey = await UserJourney.create({
        project: projectId,
        userId: userId,
        anonymousIds: [anonymousId],
        firstSeenAt: new Date(),
        lastSeenAt: new Date()
      });
    }
    
    return journey;
  }

  /**
   * Reconstructs the raw chronological path for a specific user ID.
   * Includes all events from all their anonymous sessions and identified sessions.
   */
  async getUserChronologicalPath(projectId, userId, limit = 50) {
    const journey = await UserJourney.findOne({ project: projectId, userId });
    if (!journey) return [];

    // Search events matching their actual user ID OR any of their past anonymous IDs
    return await Event.find({
      project: projectId,
      $or: [
        { userId: userId },
        { anonymousId: { $in: journey.anonymousIds } }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('event type properties context timestamp sessionId');
  }

  async findJourneysByProject(projectId, limit = 20, skip = 0) {
    return await UserJourney.find({ project: projectId })
      .sort({ lastSeenAt: -1 })
      .skip(skip)
      .limit(limit);
  }
}

export default new JourneyRepository();
