import ApiClient from './api.js';
import EventQueue from './queue.js';
import { generateAnonymousId, getStorage, setStorage, getPageContext, getScreenContext, getSessionId } from './utils.js';

class InsightPilot {
  constructor() {
    this.config = {};
    this.anonymousId = null;
    this.userId = null;
    this.api = null;
    this.queue = null;
    this.isInitialized = false;
  }

  init(publicKey, options = {}) {
    if (this.isInitialized) return;

    this.config = {
      publicKey,
      apiHost: 'http://localhost:5000/api/v1', // Default for local dev
      batchSize: 10,
      flushInterval: 5000,
      debug: false,
      autoTrackPage: true,
      ...options
    };

    this.api = new ApiClient(this.config);
    this.queue = new EventQueue(this.api, this.config);

    // Identity Management
    this.anonymousId = getStorage('ip_anonymous_id');
    if (!this.anonymousId) {
      this.anonymousId = generateAnonymousId();
      setStorage('ip_anonymous_id', this.anonymousId);
    }

    this.userId = getStorage('ip_user_id');
    this.isInitialized = true;

    if (this.config.debug) {
      console.log('InsightPilot SDK Initialized');
    }

    if (this.config.autoTrackPage) {
      this.page();
    }
  }

  _buildEvent(type, eventName, properties = {}) {
    return {
      anonymousId: this.anonymousId,
      userId: this.userId,
      event: eventName,
      type: type,
      properties: properties,
      timestamp: new Date().toISOString(),
      context: {
        sessionId: getSessionId(),
        page: getPageContext(),
        screen: getScreenContext(),
        library: { name: 'insightpilot-js', version: '1.0.0' }
      }
    };
  }

  track(eventName, properties = {}) {
    if (!this.isInitialized) return console.warn('InsightPilot not initialized');
    const event = this._buildEvent('track', eventName, properties);
    this.queue.enqueue(event);
    if (this.config.debug) console.log('Tracked Event:', eventName, event);
  }

  page(name = 'Page View', properties = {}) {
    if (!this.isInitialized) return;
    const event = this._buildEvent('page', name, properties);
    this.queue.enqueue(event);
  }

  identify(userId, traits = {}) {
    if (!this.isInitialized) return;
    this.userId = userId;
    setStorage('ip_user_id', userId);
    
    const event = this._buildEvent('identify', 'User Identified');
    event.traits = traits;
    
    this.queue.enqueue(event);
  }

  reset() {
    this.userId = null;
    this.anonymousId = generateAnonymousId();
    setStorage('ip_anonymous_id', this.anonymousId);
    if (typeof window !== 'undefined') window.localStorage.removeItem('ip_user_id');
  }

  flush() {
    if (this.queue) {
      this.queue.flush();
    }
  }
}

// Export singleton instance
const instance = new InsightPilot();
export default instance;
