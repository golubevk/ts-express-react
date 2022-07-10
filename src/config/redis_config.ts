import redis from 'redis';

import logger from './logger';

import config from './config';

const { redis: redisConfig } = config;

const client = redis.createClient(redisConfig.port, redisConfig.host, {
  db: redisConfig.db,
});

client.on('connect', () => {
  logger.info('Redis client connected');
});

client.on('error', (err: Error) => {
  logger.info(`Redis error ${err}`);
});
