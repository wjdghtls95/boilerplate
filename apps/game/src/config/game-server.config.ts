import '@extension/array.extension';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.game.test.env`,
    }),
  ],
})
export class GameServerConfig {}
