import { Redis as RedisClient } from 'ioredis';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Redis = require('ioredis');

export class RedisFactory {
  static createRedisClient(dbNumber = 0): RedisClient {
    let host: string = process.env.REDIS_DB_HOST;
    if (process.env.SSH_USED && JSON.parse(process.env.SSH_USED)) {
      host = '0.0.0.0';
    }

    return new Redis({
      host: host,
      port: Number(process.env.REDIS_DB_PORT),
      db: dbNumber,
    });
  }
}
