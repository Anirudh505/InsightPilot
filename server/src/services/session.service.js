import sessionRepository from '../repositories/session.repository.js';
import logger from '../config/logger.config.js';

class SessionService {
  /**
   * Tracks and updates session state based on incoming events
   * @param {Object} event - Enriched event object
   * @param {Object} project - Project context
   */
  async trackSession(event, project) {
    const sessionId = event.properties?.$session_id || event.context?.sessionId;
    
    if (!sessionId) return null;

    try {
      let session = await sessionRepository.findBySessionId(sessionId);
      const isPageview = event.type === 'page';
      const pageUrl = event.context?.page?.url || '';

      if (!session) {
        // Create new session
        const sessionData = {
          project: project._id,
          workspace: project.workspace,
          sessionId: sessionId,
          anonymousId: event.anonymousId,
          userId: event.userId,
          startedAt: event.timestamp,
          endedAt: event.timestamp,
          entryPage: pageUrl,
          exitPage: pageUrl,
          referrer: event.context?.page?.referrer,
          campaign: event.context?.campaign,
          browser: event.context?.browser?.name,
          os: event.context?.os?.name,
          deviceType: event.context?.device?.type,
          country: event.context?.location?.country
        };
        session = await sessionRepository.create(sessionData);
      } else {
        // Update existing session
        
        // If event timestamp is older than session start, ignore updating duration (out of order event)
        if (new Date(event.timestamp) < new Date(session.startedAt)) {
           return session;
        }

        // Calculate new duration
        const durationSeconds = Math.floor((new Date(event.timestamp) - new Date(session.startedAt)) / 1000);
        
        // Bounce logic: if duration > 10s or multiple pages viewed, not a bounce
        let isBounce = session.isBounce;
        if (durationSeconds > 10 || (isPageview && session.pageCount >= 1)) {
           isBounce = false;
        }

        await sessionRepository.updateSessionActivity(
          sessionId, 
          event.timestamp, 
          isBounce, 
          pageUrl, 
          isPageview
        );
        
        if (durationSeconds > session.durationSeconds) {
           await sessionRepository.updateDuration(sessionId, durationSeconds);
        }
      }

      return session;
    } catch (err) {
      logger.error(`Error tracking session ${sessionId}:`, err);
      return null;
    }
  }
}

export default new SessionService();
