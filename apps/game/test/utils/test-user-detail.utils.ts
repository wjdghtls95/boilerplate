import { getDatabaseByGameDbId } from '@libs/common/database/typeorm/typeorm-module.options';
import { UserDetailRepository } from '@libs/dao/game/user-detail/user-detail.repository';
import { UserRepository } from '@libs/dao/common/user/user.repository';
import { DATABASE_NAME } from '@libs/common/constants/database.constants';
import { UserDetail } from '@libs/dao/game/user-detail/user-detail.entity';

export class TestUserDetailUtils {
  /**
   * 유저 디테일 생성
   */
  static async creatUserDetail(
    userId: number,
    gameDbId: number,
  ): Promise<{ userDetail: UserDetail }> {
    const database = getDatabaseByGameDbId(gameDbId);

    const userDetail = UserDetail.create({
      userId: userId,
    });

    await UserDetailRepository.instance(database).insert(userDetail);

    const userRepository = UserRepository.instance(DATABASE_NAME.USER);

    if (userRepository) {
      await userRepository.updateById(userId, { gameDbId: gameDbId });
    }

    return { userDetail };
  }
}
