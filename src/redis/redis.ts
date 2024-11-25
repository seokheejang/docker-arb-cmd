import { createClient, RedisClientType, RedisModules, RedisScripts } from '@node-redis/client';

async function getAndPrint(redis: RedisClientType<RedisModules, RedisScripts>, key: string) {
  const val = await redis.get(key);
  console.log('redis[%s]:%s', key, val);
}

export async function readRedis(redisUrl: string, key: string) {
  const redis = createClient({ url: redisUrl });
  await redis.connect();
  await getAndPrint(redis, key);
}

export async function writeRedisPriorities(redisUrl: string, seqsUrlList: string) {
  const redis = createClient({ url: redisUrl });
  const priostring = seqsUrlList;

  await redis.connect();
  await redis.set('coordinator.priorities', priostring);
  await getAndPrint(redis, 'coordinator.priorities');
}
