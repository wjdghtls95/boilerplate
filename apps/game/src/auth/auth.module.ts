import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './strategy/basic.strategy';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { AuthService } from './auth.service';
import { SessionModule } from '@libs/dao/redis/session/session.module';

@Module({
  imports: [PassportModule, SessionModule],
  providers: [BasicStrategy, ContextProvider, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
