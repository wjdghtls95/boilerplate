import { BaseRepository } from '@libs/dao/base/base.repository';
import { EntityRepository } from '@libs/common/database/typeorm/typeorm-ex.decorator';
import { UserDetail } from '@libs/dao/game/user-detail/user-detail.entity';

export type UserDetailRepositories = Record<string, UserDetailRepository>;

@EntityRepository(UserDetail)
export class UserDetailRepository extends BaseRepository<UserDetail> {
  async findByUserId(userId: number): Promise<UserDetail> {
    return await this.getQueryBuilder()
      .where(`${this.alias}.userId=:userId`, { userId: userId })
      .getOne();
  }
}
