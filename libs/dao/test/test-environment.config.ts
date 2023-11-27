import '@extension/array.extension';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/**
 * test 할때 가장위에 import 해야됨!
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.game.test.env`,
    }),
  ],
})
export class TestEnvironConfig {}
