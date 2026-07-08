import { Session } from '../models/session.model.js';

class SessionRepository {
  async create(sessionData) {
    const session = new Session(sessionData);
    return await session.save();
  }

  async findBySessionId(sessionId) {
    return await Session.findOne({ sessionId });
  }

  async updateSessionActivity(sessionId, lastActivityTime, isBounce, pageUrl, isPageview) {
    const update = {
      $set: { endedAt: lastActivityTime, isBounce, exitPage: pageUrl },
      $inc: { eventCount: 1 }
    };
    if (isPageview) {
      update.$inc.pageCount = 1;
    }
    
    return await Session.findOneAndUpdate({ sessionId }, update, { new: true });
  }

  async updateDuration(sessionId, durationSeconds) {
    return await Session.findOneAndUpdate({ sessionId }, { $set: { durationSeconds } }, { new: true });
  }
}

export default new SessionRepository();
