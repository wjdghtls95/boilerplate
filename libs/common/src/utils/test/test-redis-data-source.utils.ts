import { Redis } from 'ioredis';

export class TestSessionUtils {
  redis: Redis;
  constructor() {}
  static async deleteAllRedis() {
    // await this.redis.fl;
  }
}
