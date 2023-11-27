import { Session } from '@libs/dao/redis/session/session.entity';
import { User } from '@libs/dao/common/user/user.entity';
import { randomUUID } from 'crypto';
import { getDatabaseByGameDbId } from '@libs/common/database/typeorm/typeorm-module.options';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { TimeUtil } from '@libs/common/utils/time.util';
import { UserRepository } from '@libs/dao/common/user/user.repository';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { UserDetailRepository } from '@libs/dao/game/user-detail/user-detail.repository';

export class TestUserUtils {
  /**
   * 유저 로그인
   */
  static async login(
    userId: number,
    gameDbId: number,
    nickName?: string,
  ): Promise<User> {
    const nid = `test${userId}`;

    let user;
    try {
      user = await TestUserUtils.createUser(
        User.create({ id: userId, nid: nid, nickName: nickName }),
      );
    } catch (e) {}

    TestUserUtils.createSession(userId, gameDbId, nid, nickName);

    return user;
  }

  /**
   * 유저 세션 발급
   */
  static createSession(
    userId: number,
    gameDbId: number,
    nid?: string,
    nickName?: string,
  ): Session {
    const session = Session.create({
      id: randomUUID(),
      userId: userId,
      nid: nid,
      database: getDatabaseByGameDbId(gameDbId),
      gameDbId: gameDbId,
      nickName: nickName,
    });

    ContextProvider.setSession(session);
    ContextProvider.setNow(TimeUtil.now());

    return session;
  }

  /**
   * 유저 생성
   */
  static async createUser(user: User): Promise<User> {
    const userRepository = UserRepository.instance(DATABASE_NAME.USER);

    if (!userRepository) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.USER_ALREADY_CREATED);
    }

    await userRepository.insert(user);
    return user;
  }

  /**
   * nid로 유저 생성
   */
  static async createUserByNid(nid: string): Promise<User> {
    const user = User.create({ nid: nid });
    await UserRepository.instance(DATABASE_NAME.USER).insert(user);

    return user;
  }

  /**
   * 유저 삭제 (UserDetail, User)부분 test시 생성된 row 삭제 시켜야 나중에 꼬이지 않음
   */
  static async deleteUser(userId: number, gameDbId: number) {
    const database = getDatabaseByGameDbId(gameDbId);

    await UserDetailRepository.instance(database).delete({
      userId: userId,
    });

    const userRepository = await UserRepository.instance(DATABASE_NAME.USER);

    if (userRepository) {
      await userRepository.delete({ id: userId });
    }
  }
}
