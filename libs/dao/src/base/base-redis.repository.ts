import { Redis } from 'ioredis';
import { RedisFactory } from '@libs/common/database/redis/redis.factory';

export abstract class BaseRedisRepository {
  protected readonly redis: Redis;
  protected readonly dbNumber: number;

  protected constructor() {
    this.redis = RedisFactory.createRedisClient(this.dbNumber);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async flushDb(): Promise<'OK'> {
    return this.redis.flushdb();
  }

  async close(): Promise<'OK'> {
    return this.redis.quit();
  }
}
