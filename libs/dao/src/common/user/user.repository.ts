import { EntityRepository } from '@libs/common/database/typeorm/typeorm-ex.decorator';
import { BaseRepository } from '@libs/dao/base/base.repository';
import { User } from '@libs/dao/common/user/user.entity';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  async findByNid(nid: string): Promise<User> {
    return await this.getQueryBuilder()
      .where(`${this.alias}.nid=:nid`, { nid: nid })
      .getOne();
  }

  async findByNickName(nickName: string): Promise<User> {
    return await this.getQueryBuilder()
      .where(`${this.alias}.nickName=:nickName`, { nickName: nickName })
      .getOne();
  }
}
