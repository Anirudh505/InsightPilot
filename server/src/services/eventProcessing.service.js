import { UAParser } from 'ua-parser-js';
import eventRepository from '../repositories/event.repository.js';
import sessionService from './session.service.js';
import logger from '../config/logger.config.js';

class EventProcessingService {
  /**
   * Process a single event payload from the SDK
   */
  async processEvent(payload, project, ipAddress, userAgent) {
    const enrichedEvent = this._enrichEvent(payload, project, ipAddress, userAgent);
    
    // Manage session lifecycle
    const sessionResult = await sessionService.trackSession(enrichedEvent, project);
    if (sessionResult) {
      enrichedEvent.sessionId = sessionResult.sessionId;
    }

    return await eventRepository.create(enrichedEvent);
  }

  /**
   * Process a batch of events from the SDK
   */
  async processBatch(eventsArray, project, ipAddress, userAgent) {
    if (!Array.isArray(eventsArray) || eventsArray.length === 0) {
      return { success: true, processed: 0 };
    }

    const enrichedEvents = [];
    
    // We sort events chronologically to ensure session logic processes in order
    const sortedEvents = eventsArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    for (const payload of sortedEvents) {
      try {
        const enriched = this._enrichEvent(payload, project, ipAddress, userAgent);
        const sessionResult = await sessionService.trackSession(enriched, project);
        if (sessionResult) {
          enriched.sessionId = sessionResult.sessionId;
        }
        enrichedEvents.push(enriched);
      } catch (err) {
        logger.warn(`Failed to process event in batch: ${err.message}`);
        // Continue processing others
      }
    }

    if (enrichedEvents.length > 0) {
      await eventRepository.insertMany(enrichedEvents);
    }

    return { success: true, processed: enrichedEvents.length, total: eventsArray.length };
  }

  /**
   * Private helper to parse User Agent, IP, and structure the data
   */
  _enrichEvent(payload, project, ipAddress, rawUserAgent) {
    // Determine the user agent to parse (client might override if sending backend-to-backend)
    const uaToParse = payload.context?.userAgent || rawUserAgent || '';
    const parser = new UAParser(uaToParse);
    const result = parser.getResult();

    // Map payload
    const event = {
      project: project._id,
      workspace: project.workspace,
      anonymousId: payload.anonymousId,
      userId: payload.userId || null,
      event: payload.event,
      type: payload.type || 'track',
      properties: payload.properties || {},
      traits: payload.traits || {},
      timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
      context: {
        ...payload.context, // Spread existing context sent by SDK
        ip: ipAddress,
        userAgent: uaToParse,
        browser: {
          name: result.browser.name || payload.context?.browser?.name,
          version: result.browser.version || payload.context?.browser?.version,
        },
        os: {
          name: result.os.name || payload.context?.os?.name,
          version: result.os.version || payload.context?.os?.version,
        },
        device: {
          ...payload.context?.device,
          type: result.device.type || 'desktop', // fallback
          model: result.device.model,
          manufacturer: result.device.vendor
        }
      }
    };

    // Geo-parsing could be added here using a library like geoip-lite if required.

    return event;
  }
}

export default new EventProcessingService();
