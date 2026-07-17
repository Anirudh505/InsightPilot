import { env } from '../config/env.config.js';
import logger from '../config/logger.config.js';

class AIProviderService {
  constructor() {
    this.apiKey = env.openaiApiKey; // Or any generic AI API Key
    this.baseUrl = env.aiBaseUrl || 'https://api.openai.com/v1'; // Allows plugging in Anthropic/Local proxies
    this.model = env.aiModel || 'gpt-4o';
  }

  /**
   * Universal abstraction for calling a chat completion endpoint.
   * Expects OpenAI API signature for maximum compatibility.
   */
  async generateCompletion(messages, options = {}) {
    if (!this.apiKey || this.apiKey === 'placeholder') {
      logger.warn('AI API Key is not configured. Returning mock response.');
      return this._generateMockResponse(messages);
    }

    const { temperature = 0.7, maxTokens = 1000, jsonMode = false } = options;

    const payload = {
      model: this.model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        usage: data.usage || { total_tokens: 0 }
      };

    } catch (err) {
      logger.error('AI Provider Error', err);
      throw err;
    }
  }

  _generateMockResponse(messages) {
    // A fallback for environments without an API key (like local dev)
    return {
      content: JSON.stringify({
        recommendation: "Increase onboarding tooltips.",
        impact: "Could increase Day 1 retention by 5%.",
        priority: "medium",
        confidence: 85
      }),
      usage: { total_tokens: 42 }
    };
  }
}

export default new AIProviderService();
