import { NestFactory } from '@nestjs/core';
import { GameModule } from './game.module';
import { GameServer } from './game.server';

async function gameServer() {
  const app = await NestFactory.create(GameModule);

  const gameServer = new GameServer(app);

  await gameServer.init();
  await gameServer.run();
}
gameServer();
