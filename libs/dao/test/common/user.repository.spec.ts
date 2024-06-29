import { TestEnvironConfig } from '../test-environment.config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@libs/dao/common/user/user.repository';
import { TypeOrmExModule } from '@libs/common/database/typeorm/typeorm-ex.module';
import { commonTypeOrmModuleOptions } from '@libs/common/database/typeorm/typeorm-module.options';
import { User } from '@libs/dao/common/user/user.entity';
import { UserModule } from '@libs/dao/common/user/user.module';
import { TestTransactionUtils } from '@libs/common/utils/test/test-transaction.utils';
import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { TestDataSourceUtils } from '@libs/common/utils/test/test-data-source.utils';

describe('user repository test', () => {
  let module: TestingModule;
  let userRepository: UserRepository;
  let nid: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TestEnvironConfig,

        TypeOrmExModule.forRoot({
          ...commonTypeOrmModuleOptions,
          entities: [User],
        }),
        UserModule,
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);

    nid = 'test100';
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([DATABASE_NAME.USER]);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
  });

  // beforeAll의 module을 정리함
  afterAll(async () => {
    await TestDataSourceUtils.clearDataSource(module);
  });

  it('create user', async () => {
    const user = await TestUserUtils.createUserByNid(nid);

    expect(user.id).toBeDefined();
    expect(user.nid).toBe(nid);

    try {
      await TestUserUtils.createUserByNid(nid);
      fail('ER_DUP_ENTRY not thrown');
    } catch (e) {
      expect(e.code).toBe('ER_DUP_ENTRY');
    }
  });

  it('get user', async () => {
    const user = await await TestUserUtils.createUserByNid(nid);

    let findUser = await userRepository.findById(user.id);
    expect(findUser.id).toBe(user.id);
    expect(findUser.nid).toBe(user.nid);

    findUser = await userRepository.findByNid(nid);
    expect(findUser.id).toBe(user.id);
    expect(findUser.nid).toBe(user.nid);
  });

  it('update user', async () => {
    const user = await TestUserUtils.createUserByNid(nid);

    const nickname = 'nickname';

    user.nickName = nickname;
    await userRepository.updateById(user.id, user);

    const findUser = await userRepository.findById(user.id);

    expect(findUser.id).toBe(user.id);
    expect(findUser.nid).toBe(user.nid);
    expect(findUser.nickName).toBe(nickname);

    try {
      await userRepository.insert(
        User.create({
          nid: 'test101',
          nickName: nickname,
        }),
      );
      fail('ER_DUP_ENTRY not thrown');
    } catch (e) {
      expect(e.code).toBe('ER_DUP_ENTRY');
    }
  });
});
