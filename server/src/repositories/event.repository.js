import { Event } from '../models/event.model.js';

class EventRepository {
  async create(eventData) {
    const event = new Event(eventData);
    return await event.save();
  }

  async insertMany(eventsArray) {
    return await Event.insertMany(eventsArray, { ordered: false });
  }

  // Analytical Querying
  async countEventsByProject(projectId, eventName = null, startDate, endDate) {
    const query = { project: projectId, timestamp: { $gte: startDate, $lte: endDate } };
    if (eventName) {
      query.event = eventName;
    }
    return await Event.countDocuments(query);
  }

  // Find users who did X
  async findDistinctUsers(projectId, eventName, startDate, endDate) {
    return await Event.distinct('anonymousId', {
      project: projectId,
      event: eventName,
      timestamp: { $gte: startDate, $lte: endDate }
    });
  }
}

export default new EventRepository();
