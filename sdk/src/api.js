class ApiClient {
  constructor(config) {
    this.endpoint = config.apiHost || 'https://api.insightpilot.com/api/v1';
    this.publicKey = config.publicKey;
  }

  async sendRequest(path, payload) {
    try {
      const response = await fetch(`${this.endpoint}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.publicKey
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (this.config?.debug) {
        console.error('InsightPilot API Error:', error);
      }
      throw error;
    }
  }

  async collect(event) {
    return this.sendRequest('/events/collect', event);
  }

  async batch(events) {
    return this.sendRequest('/events/batch', { events });
  }
}

export default ApiClient;
