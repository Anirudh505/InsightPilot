class EventQueue {
  constructor(apiClient, config) {
    this.api = apiClient;
    this.queue = [];
    this.batchSize = config.batchSize || 20;
    this.flushIntervalMs = config.flushInterval || 5000;
    this.timer = null;
  }

  enqueue(event) {
    this.queue.push(event);
    
    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushIntervalMs);
    }
  }

  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      await this.api.batch(eventsToSend);
    } catch (err) {
      // Offline or error -> re-queue for later
      this.queue = [...eventsToSend, ...this.queue];
    }
  }
}

export default EventQueue;
