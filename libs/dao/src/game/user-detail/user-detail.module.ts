import { Module } from '@nestjs/common';
import { UserDetailRepository } from '@libs/dao/game/user-detail/user-detail.repository';
import { TypeOrmExModule } from '@libs/common/database/typeorm/typeorm-ex.module';
import { gameShardDatabases } from '@libs/common/database/typeorm/typeorm-module.options';

@Module({
  imports: [
    TypeOrmExModule.forFeatures([UserDetailRepository], gameShardDatabases),
  ],
  exports: [TypeOrmExModule],
})
export class UserDetailModule {}
