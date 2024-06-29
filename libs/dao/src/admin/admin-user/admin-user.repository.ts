import { BaseRepository } from '@libs/dao/base/base.repository';
import { AdminUser } from '@libs/dao/admin/admin-user/admin-user.entity';
import { EntityRepository } from '@libs/common/database/typeorm/typeorm-ex.decorator';

@EntityRepository(AdminUser)
export class AdminUserRepository extends BaseRepository<AdminUser> {
  async findByEmail(email: string): Promise<AdminUser> {
    return await this.getQueryBuilder()
      .where(`${this.alias}.email=:email`, { email: email })
      .getOne();
  }
}
