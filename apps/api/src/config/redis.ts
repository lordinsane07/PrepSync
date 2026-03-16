import Redis from 'ioredis';
import { env } from './env';

let redis: Redis | null = null;

export function connectRedis(): Redis {
  if (redis) return redis;

  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      if (times > 3 && env.NODE_ENV === 'development') {
        console.warn('[Redis] Connection failed — running without Redis.');
        return null; // stop retrying
      }
      const delay = Math.min(times * 200, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  redis.on('connect', () => {
    console.log('[Redis] Connected successfully');
  });

  redis.on('error', (error: Error) => {
    if (env.NODE_ENV !== 'development') {
      console.error('[Redis] Connection error:', error.message);
    }
  });

  redis.connect().catch((error: Error) => {
    if (env.NODE_ENV === 'development') {
      console.warn('[Redis] Not available — running without Redis cache.');
    } else {
      console.error('[Redis] Initial connection failed:', error.message);
    }
  });

  return redis;
}

export function getRedis(): Redis | null {
  return redis;
}

export function isRedisConnected(): boolean {
  return redis?.status === 'ready';
}
