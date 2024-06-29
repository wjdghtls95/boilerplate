import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants.';
import { AdminModule } from './admin.module';

export class AdminServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * 서버 초기화
   */
  init(): void {
    //OPEN API - swagger
    this._initializeSwagger();
  }

  /**
   * OPEN API(Swagger) 초기화
   */
  private _initializeSwagger(): void {
    if (process.env.NODE_ENV !== 'prod') {
      const config = new DocumentBuilder()
        .setTitle('BoilerPlate Admin Server')
        .setDescription('The BoilerPlate ADMIN API description')
        .setVersion('1.0')
        .build();

      const document = SwaggerModule.createDocument(this.app, config, {
        include: [AdminModule],
      });

      SwaggerModule.setup(
        'api-docs',
        this.app,
        document,
        SWAGGER_CUSTOM_OPTIONS,
      );
    }
  }

  /**
   * 서버 실행
   */
  async run(): Promise<void> {
    Logger.log('Admin Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }
}
