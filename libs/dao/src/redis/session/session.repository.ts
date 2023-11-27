import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { Redis } from 'ioredis';
import { RedisFactory } from '@libs/common/database/redis/redis.factory';
import { Session } from '@libs/dao/redis/session.entity';

@Injectable()
export class SessionRepository {
  redis: Redis;
  constructor() {
    this.redis = RedisFactory.createRedisClient();
  }

  static createSession(
    userId: number,
    nid: string,
    gameDbId: number,
    database: string,
    nickName: string,
  ): Session {
    return Session.create({
      id: randomUUID(),
      userId: userId,
      nid: nid,
      gameDbId: gameDbId,
      database: database,
      nickName: nickName,
    });
  }

  async getSession(userId: string): Promise<Session> {
    const result = JSON.parse(await this.redis.get(userId));
    return plainToInstance(Session, result);
  }

  async setSession(userId: string, session: Session, ttl = 0): Promise<string> {
    const result = await this.redis.set(userId, JSON.stringify(session));
    if (ttl) await this.redis.expire(userId, ttl);
    return result;
  }

  async delSession(userId: string): Promise<number> {
    return this.redis.del(userId);
  }

  async close(): Promise<'OK'> {
    return this.redis.quit();
  }
}
