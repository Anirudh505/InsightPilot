import Redis from 'ioredis';
import { env } from '../config/env.config.js';
import logger from '../config/logger.config.js';

class CacheService {
  constructor() {
    this.client = null;
    this.memoryCache = new Map(); // Fallback if Redis is disabled or fails
    this.isRedisConnected = false;

    if (env.redisUrl && env.redisUrl !== 'redis://localhost:6379' && !env.redisUrl.includes('placeholder')) {
      try {
        this.client = new Redis(env.redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => Math.min(times * 50, 2000)
        });

        this.client.on('connect', () => {
          this.isRedisConnected = true;
          logger.info('Connected to Redis Cache');
        });

        this.client.on('error', (err) => {
          this.isRedisConnected = false;
          logger.warn(`Redis Error: ${err.message}. Falling back to Memory Cache.`);
        });
      } catch (err) {
        logger.warn('Failed to initialize Redis. Using Memory Cache.');
      }
    } else {
      logger.info('Redis URL not configured properly. Using Memory Cache.');
    }
  }

  async get(key) {
    if (this.isRedisConnected) {
      try {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        return this.memoryCache.get(key) || null;
      }
    }
    
    // Memory fallback logic
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, ttlSeconds = 300) {
    if (this.isRedisConnected) {
      try {
        await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return true;
      } catch (err) {
        // Fallthrough to memory
      }
    }

    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
    return true;
  }

  async invalidatePrefix(prefix) {
    if (this.isRedisConnected) {
      const keys = await this.client.keys(`${prefix}*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } else {
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(prefix)) {
          this.memoryCache.delete(key);
        }
      }
    }
  }
}

export default new CacheService();
