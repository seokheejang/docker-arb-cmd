import { createClient, RedisClientType, RedisModules, RedisScripts } from '@node-redis/client';

async function getAndPrint(redis: RedisClientType<RedisModules, RedisScripts>, key: string) {
  const val = await redis.get(key);
  console.log('redis[%s]:%s', key, val);
}

export async function readRedis(redisUrl: string, key: string) {
  const redis = createClient({ url: redisUrl });
  await redis.connect();
  await getAndPrint(redis, key);

  await redis.disconnect();
}

export async function writeRedisPriorities(redisUrl: string, seqsUrlList: string) {
  const redis = createClient({ url: redisUrl });
  const priostring = seqsUrlList;

  await redis.connect();
  await redis.set('coordinator.priorities', priostring);
  await getAndPrint(redis, 'coordinator.priorities');

  await redis.disconnect();
}

export async function initRedis(redisUrl: string) {
  const redis = createClient({ url: redisUrl });
  await redis.connect();

  const keys = await redis.keys('*');
  if (keys.length > 0) {
    await redis.del(keys);
    console.log('All keys have been deleted and Redis is initialized.');
  } else {
    console.log('No keys found in Redis. It is already initialized.');
  }
  await redis.disconnect();
}
