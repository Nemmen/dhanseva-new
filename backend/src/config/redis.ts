import { createClient, RedisClientType } from 'redis';
import { config } from './index';

let redisClient: RedisClientType | null = null;
let connectionPromise: Promise<void> | null = null;

const createRedisClient = () => {
  const client = createClient({
    username: config.redis.username,
    password: config.redis.password,
    socket: {
      host: config.redis.host,
      port: config.redis.port,
    },
  });

  client.on('error', (err: Error) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('Redis connected successfully'));

  return client;
};

export const connectRedis = async () => {
  // If already connected, return
  if (redisClient?.isOpen) {
    return;
  }

  // If connection in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // Create new connection
  connectionPromise = (async () => {
    try {
      if (!redisClient) {
        redisClient = createRedisClient();
      }
      await redisClient.connect();
      console.log('✅ Redis connection established');
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      redisClient = null;
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
};

export const getRedisClient = async (): Promise<RedisClientType> => {
  await connectRedis();
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

export { redisClient };
