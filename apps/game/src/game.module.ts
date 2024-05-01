import { GameServerConfig } from './config/game-server.config';
import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/database/typeorm/typeorm-ex.module';
import {
  commonTypeOrmModuleOptions,
  gameTypeOrmModuleOptions,
} from '@libs/common/database/typeorm/typeorm-module.options';
import { SessionModule } from '@libs/dao/redis/session/session.module';
import { AuthModule } from './auth/auth.module';
import { LoginController } from './login/login.controller';
import { UserModule } from '@libs/dao/common/user/user.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';
import { LoginService } from './login/login.service';
import { UserService } from './user/user.service';
import { UserDetailModule } from '@libs/dao/game/user-detail/user-detail.module';
import { UserLevelLockInterceptor } from '@libs/common/interceptor/user-level-lock.interceptor';
import { UserController } from './user/user.controller';
import { TransactionInterceptor } from '@libs/common/interceptor/transaction.interceptor';
import { GameService } from './default/game.service';
import { GameController } from './default/game.controller';
import { RequestLogInterceptor } from '@libs/common/interceptor/request-log.interceptor';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    GameServerConfig,
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),
    TypeOrmExModule.forRoot(commonTypeOrmModuleOptions),
    ...Object.values(gameTypeOrmModuleOptions).map((options) =>
      TypeOrmExModule.forRoot(options),
    ),
    // Redis
    SessionModule,

    // Dao
    AuthModule,

    // Common
    UserModule,

    // Game
    UserDetailModule,
  ],
  controllers: [GameController, LoginController, UserController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: RequestLogInterceptor },
    { provide: APP_INTERCEPTOR, useClass: UserLevelLockInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },

    //service
    GameService,
    LoginService,
    UserService,
  ],
})
export class GameModule {}
