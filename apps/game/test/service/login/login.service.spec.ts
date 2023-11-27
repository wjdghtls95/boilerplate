import { GameServerConfig } from '../../../src/config/game-server.config';
import { Test, TestingModule } from '@nestjs/testing';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { commonTypeOrmModuleOptions } from '@libs/common/database/typeorm/typeorm-module.options';
import { TypeOrmExModule } from '@libs/common/database/typeorm/typeorm-ex.module';
import { User } from '@libs/dao/common/user/user.entity';
import { SessionModule } from '@libs/dao/redis/session/session.module';
import { UserModule } from '@libs/dao/common/user/user.module';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { LoginService } from '../../../src/login/login.service';
import { LoginInDto } from '../../../src/login/dto/login-in.dto';
import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { TestTransactionUtils } from '@libs/common/utils/test/test-transaction.utils';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { TestDataSourceUtils } from '@libs/common/utils/test/test-data-source.utils';
import { TestRedisDataSourceUtils } from '@libs/common/utils/test/test-redis-data-source.utils';

describe('login service', () => {
  let module: TestingModule;
  let sessionRepository: SessionRepository;
  let loginService: LoginService;
  let nid: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        GameServerConfig,
        TypeOrmExModule.forRoot({
          ...commonTypeOrmModuleOptions,
          entities: [User],
        }),

        // module
        SessionModule,
        UserModule,
      ],
      providers: [LoginService, ContextProvider],
    }).compile();

    // repository
    sessionRepository = module.get<SessionRepository>(SessionRepository);

    // service
    loginService = module.get<LoginService>(LoginService);

    nid = 'testNid';
  });

  beforeEach(async () => {
    // 유저 db transaction 설정
    await TypeOrmHelper.Transactional([DATABASE_NAME.USER]);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
  });

  afterAll(async () => {
    await TestRedisDataSourceUtils.clearRedisDataSource(module);

    await TestDataSourceUtils.clearDataSource(module);
  });

  it('login', async () => {
    const loginInDto = new LoginInDto();
    loginInDto.nid = nid;

    const loginOutDto = await loginService.login(loginInDto);

    expect(loginOutDto.sessionId).toBeDefined();
    expect(loginOutDto.userId).toBeDefined();
  });

  it('refresh session', async () => {
    const loginInDto = new LoginInDto();
    loginInDto.nid = nid;

    const loginOutDto = await loginService.login(loginInDto);

    expect(loginOutDto.sessionId).toBeDefined();
    expect(loginOutDto.userId).toBeDefined();

    try {
      await loginService.refreshSession();
      fail('SESSION_NOT_FOUND not thrown');
    } catch (e) {
      expect(e.response).toEqual(INTERNAL_ERROR_CODE.SESSION_NOT_FOUND);
    }

    const session = await sessionRepository.getSession(
      loginOutDto.userId.toString(),
    );

    ContextProvider.setSession(session);

    // refresh 된 session 이랑 기존 session 이랑 달라야되고 userId는 같아야됨
    const refresh = await loginService.refreshSession();

    expect(refresh.userId).toBe(loginOutDto.userId);
    // not 으로 다른거 확인
    expect(refresh.sessionId).not.toBe(loginOutDto.sessionId);
  });
});
