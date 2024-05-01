import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/database/typeorm/typeorm-ex.module';
import { UserRepository } from '@libs/dao/common/user/user.repository';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';

@Module({
  imports: [
    TypeOrmExModule.forFeatures([UserRepository], [DATABASE_NAME.USER]),
  ],
  exports: [TypeOrmExModule],
})
export class UserModule {}
