import journeyRepository from '../repositories/journey.repository.js';
import { NotFoundError } from '../utils/ApiError.js';

class JourneyService {
  /**
   * Called primarily during the Event Ingestion Pipeline (Sprint 5/7 integration)
   * Whenever an 'identify' event occurs, we link their anonymous IDs.
   */
  async handleIdentifyEvent(projectId, anonymousId, userId, traits) {
    const journey = await journeyRepository.mapAnonymousToUser(projectId, anonymousId, userId);
    
    // If they passed traits, update them
    if (journey && traits && Object.keys(traits).length > 0) {
      // In production, we'd use Mongoose deep merging here
      journey.traits = { ...journey.traits, ...traits };
      await journey.save();
    }
    return journey;
  }

  async getJourneys(projectId, limit = 20, skip = 0) {
    return await journeyRepository.findJourneysByProject(projectId, limit, skip);
  }

  async getJourneyPath(projectId, userId) {
    const path = await journeyRepository.getUserChronologicalPath(projectId, userId);
    if (!path || path.length === 0) {
      throw new NotFoundError('No journey found for this user');
    }
    return path;
  }
}

export default new JourneyService();
