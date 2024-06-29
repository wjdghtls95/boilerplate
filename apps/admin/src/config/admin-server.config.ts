import '@extension/array.extension';

import { Module } from '@nestjs/common';
import adminDatabaseConfig from '../../../../libs/dao/src/config/admin/admin-database.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.admin.${process.env.NODE_ENV}.env`,
      load: [adminDatabaseConfig],
    }),
  ],
})
export class AdminServerConfig {}
