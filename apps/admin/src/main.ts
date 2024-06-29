import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';

import { AdminServer } from './admin.server';

async function adminServer(): Promise<void> {
  const app = await NestFactory.create(AdminModule);

  const adminServer = new AdminServer(app);
  adminServer.init();
  await adminServer.run();
}
void adminServer();
