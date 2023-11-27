import { GameServerConfig } from '../../../src/config/game-server.config';
import {
  commonTypeOrmModuleOptions,
  gameTypeOrmModuleOptions,
} from '@libs/common/database/typeorm/typeorm-module.options';
import { TypeOrmExModule } from '@libs/common/database/typeorm/typeorm-ex.module';
import { Test, TestingModule } from '@nestjs/testing';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { User } from '@libs/dao/common/user/user.entity';
import { UserModule } from '@libs/dao/common/user/user.module';
import { UserDetail } from '@libs/dao/game/user-detail/user-detail.entity';
import { SessionModule } from '@libs/dao/redis/session/session.module';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { UserService } from '../../../src/user/user.service';
import { TestTransactionUtils } from '@libs/common/utils/test/test-transaction.utils';
import { UserDetailModule } from '@libs/dao/game/user-detail/user-detail.module';
import { TestUserUtils } from '../../utils/test-user.utils';
import { UpdateUserNickNameInDto } from '../../../src/user/dto/update-user-nick-name-in.dto';
import { TestDataSourceUtils } from '@libs/common/utils/test/test-data-source.utils';
import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';

// 1, 2, 3, 4 순서대로 실행
describe('user service v2', () => {
  let module: TestingModule;
  let userService: UserService;
  let sessionRepository: SessionRepository;
  let userId: number;
  let gameDbId: number;
  let userId_2: number;
  let gameDbId_2: number;

  // 1
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        GameServerConfig,
        TypeOrmExModule.forRoot({
          ...commonTypeOrmModuleOptions,
          entities: [User],
        }),
        ...Object.values(gameTypeOrmModuleOptions).map((dataSource) =>
          TypeOrmExModule.forRoot({
            ...dataSource,
            entities: [UserDetail],
          }),
        ),

        SessionModule,
        UserModule,
        UserDetailModule,
      ],
      providers: [
        // service
        UserService,
      ],
    }).compile();

    sessionRepository = module.get<SessionRepository>(SessionRepository);
    userService = module.get<UserService>(UserService);

    userId = 1;
    gameDbId = 100;

    userId_2 = 2;
    gameDbId_2 = 101;
  });

  // 2
  beforeEach(async () => {
    await TypeOrmHelper.Transactional([DATABASE_NAME.USER]);
    // create user
    await TestUserUtils.login(userId, gameDbId);
  });

  // 4
  afterEach(async () => {
    await TestTransactionUtils.rollback();
  });

  // 3
  afterAll(async () => {
    await sessionRepository.close();

    //clearDataSource로 data source destroy 시켜야 없어짐
    await TestDataSourceUtils.clearDataSource(module);
  });

  it('check created', async () => {
    expect(await userService.isNotFoundUserDetail()).toBeTruthy();
  });

  it('get user', async () => {
    try {
      await userService.getUser();
      fail('USER_DETAIL_NOT_FOUND not thrown');
    } catch (e) {
      expect(e.response).toEqual(INTERNAL_ERROR_CODE.USER_DETAIL_NOT_FOUND);
    }

    await userService.createUserDetail();

    // get user detail
    const { userDetail } = await userService.getUser();

    expect(userDetail.userId).toBe(userId);
    expect(await userService.isNotFoundUserDetail()).toBeFalsy();
  });

  it('create user', async () => {
    expect(await userService.isNotFoundUserDetail()).toBeTruthy();

    try {
      await userService.getUser();
      fail('USER_DETAIL_NOT_FOUND not thrown');
    } catch (e) {
      expect(e.response).toEqual(INTERNAL_ERROR_CODE.USER_DETAIL_NOT_FOUND);
    }

    // create user detail
    const userDetailDto = await userService.createUserDetail();
    expect(userDetailDto.id).toBeDefined();
    expect(userDetailDto.userId).toBe(userId);

    // get user detail
    const { userDetail, user } = await userService.getUser();

    expect(userDetail.userId).toBe(userId);
    expect(await userService.isNotFoundUserDetail()).toBeFalsy();
    expect(user.id).toBe(userId);

    try {
      await userService.createUserDetail();
      fail('USER_ALREADY_CREATED not thrown');
    } catch (e) {
      expect(e.response).toEqual(INTERNAL_ERROR_CODE.USER_ALREADY_CREATED);
    }
  });

  it('update nickname', async () => {
    // create user detail
    await userService.createUserDetail();

    // 닉네임 변경
    const nickName = 'testNickName';
    const updateUserNickNameInDto = new UpdateUserNickNameInDto();
    updateUserNickNameInDto.nickName = nickName;

    const userDto = await userService.updateUserNickName(
      updateUserNickNameInDto,
    );

    expect(userDto.id).toBe(userId);
    expect(userDto.nickName).toBe(nickName);

    // 만약 같은 닉네임을 업데이트할때 에러가 잘 나오는지 test
    try {
      await userService.updateUserNickName(updateUserNickNameInDto);
      fail('USER_NICK_NAME_UPDATE_SAME not thrown');
    } catch (e) {
      expect(e.response).toEqual(
        INTERNAL_ERROR_CODE.USER_NICK_NAME_UPDATE_SAME,
      );
    }

    // 다른 유저랑 닉네임이 겹칠때 true / false test
    const conflictNickName: string = 'conflictNickName';

    await TestUserUtils.createUser(
      User.create({
        id: userId_2,
        nid: `test${userId_2}`,
        nickName: conflictNickName,
        gameDbId: gameDbId_2,
      }),
    );

    updateUserNickNameInDto.nickName = conflictNickName;
    const result = await userService.existNickName(conflictNickName);

    expect(result).toBeTruthy();
  });
});
