import { Module } from '@nestjs/common';
import { SessionRepository } from '@libs/dao/redis/session.repository';

@Module({
  providers: [SessionRepository],
  exports: [SessionRepository],
})
export class SessionModule {}
