import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants.';

export class GameServer {
  constructor(private readonly app: INestApplication) {}

  /**
   * 서버 초기화
   */
  async init(): Promise<void> {
    this._initializeSwagger();
  }

  /**
   * OPEN API(SWAGGER) 초기화
   */
  private _initializeSwagger(): void {
    if (process.env.NODE_ENV !== 'prod') {
      const config = new DocumentBuilder()
        .setTitle('game-server-boilerplate project')
        .setDescription('The game-server-boilerplate project description')
        .setVersion('1.0')
        .addBasicAuth(
          {
            type: 'http',
            name: 'Authorization',
            in: 'header',
            description: 'Username:userId & Password:sessionId',
          },
          'basic',
        )
        .build();
      const document = SwaggerModule.createDocument(this.app, config);

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
    Logger.log('Game Server is running on port ' + process.env.SERVER_PORT);
    await this.app.listen(process.env.SERVER_PORT, '0.0.0.0');
  }
}
