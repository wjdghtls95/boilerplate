import '@extension/array.extension';
import '@extension/json.extension';
import '@extension/date.extension';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import commonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import gameDatabaseConfig from '@libs/dao/config/game/game-database.config';

/**
 * test 할때 가장 위에 import
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.game.test.env',
      isGlobal: true,
      cache: true,
      load: [commonDatabaseConfig, gameDatabaseConfig],
    }),
  ],
})
export class TestEnvironmentConfig {}
