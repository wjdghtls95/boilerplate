import { TestingModule } from '@nestjs/testing';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { BaseRedisRepository } from '@libs/dao/base/base-redis.repository';

export class TestRedisDataSourceUtils {
  /**
   * 모든 레디스 정보 클리어
   */
  static async clearRedisDataSource(module: TestingModule): Promise<void> {
    const redisDataSourceMap =
      await TestRedisDataSourceUtils.getRedisRepositories(module);

    await TestRedisDataSourceUtils.redisFlushDb(module);

    await Promise.all(redisDataSourceMap.map(async (it) => await it.close()));
  }

  /**
   * 레디스 데이터 초기화
   */
  static async redisFlushDb(module: TestingModule): Promise<void> {
    const redisDataSourceMap =
      await TestRedisDataSourceUtils.getRedisRepositories(module);

    for (const redisDataSource of redisDataSourceMap) {
      await redisDataSource.flushDb();
    }
  }

  /**
   * 모든 레디스 레포지토리 조회
   */
  static async getRedisRepositories(
    module: TestingModule,
  ): Promise<BaseRedisRepository[]> {
    const redisDataSourceMap: BaseRedisRepository[] = [];

    // session
    try {
      const sessionRepository =
        module.get<SessionRepository>(SessionRepository);

      redisDataSourceMap.push(sessionRepository);
    } catch (e) {}

    return redisDataSourceMap;
  }
}
