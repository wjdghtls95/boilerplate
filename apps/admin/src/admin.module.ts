import { AdminServerConfig } from './config/admin-server.config';
import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import adminDatabaseConfig from '../../../libs/dao/src/config/admin/admin-database.config';
import { DataSourceOptions } from 'typeorm';
import { DefaultController } from './default/default.controller';
import { DefaultService } from './default/default.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/common/filter/all-exception.filter';

@Module({
  imports: [
    // config
    AdminServerConfig,

    // admin (RDBMS)
    TypeOrmModule.forRootAsync({
      name: adminDatabaseConfig().name,
      inject: [adminDatabaseConfig.KEY],
      useFactory: (config: DataSourceOptions) => config,
    }),

    // admin
  ],
  controllers: [DefaultController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionFilter },

    // health
    DefaultService,
  ],
})
export class AdminModule {}
