import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '@libs/dao/common/user/user.repository';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { LoginOutDto } from './dto/login-out.dto';
import { User } from '@libs/dao/common/user/user.entity';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { LoginInDto } from './dto/login-in.dto';
import { SESSION_EXPIRED_TIME } from '../constants/login.constants';
import { TimeUtil } from '@libs/common/utils/time.util';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import {
  getDatabaseByGameDbId,
  getGameDbIdFromUserId,
} from '@libs/common/database/typeorm/typeorm-module.options';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { Session } from '@libs/dao/redis/session/session.entity';

@Injectable()
export class LoginService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly sessionRepository: SessionRepository,
  ) {}

  /**
   * 로그인
   */
  async login(loginInDto: LoginInDto): Promise<LoginOutDto> {
    // get user
    const user = await this._getUserByNid(loginInDto.nid);

    // create session
    const session = SessionRepository.createSession(
      user.id,
      user.nid,
      user.gameDbId,
      getDatabaseByGameDbId(user.gameDbId),
      user.nickName,
    );

    await this.sessionRepository.setSession(
      user.id.toString(),
      session,
      process.env.NODE_ENV === '' || 'test' ? 0 : SESSION_EXPIRED_TIME,
    );

    return LoginOutDto.of({
      userId: user.id,
      sessionId: session.id,
      serverTimeDate: TimeUtil.now(),
    });
  }

  /**
   * 세션 갱신
   */
  async refreshSession(): Promise<LoginOutDto> {
    const session: Session = ContextProvider.getSession();

    if (!session) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_NOT_FOUND);
    }

    // create new session
    const newSession = SessionRepository.createSession(
      session.userId,
      session.nid,
      session.gameDbId,
      session.database,
      session.nickName,
    );

    await this.sessionRepository.setSession(
      newSession.userId.toString(),
      newSession,
      process.env.NODE_ENV === '' || 'test' ? 0 : SESSION_EXPIRED_TIME,
    );

    return LoginOutDto.of({
      userId: newSession.userId,
      sessionId: newSession.id,
      serverTimeDate: TimeUtil.now(),
    });
  }

  /**
   * nid로 유저 get
   */
  private async _getUserByNid(nid: string): Promise<User> {
    let user = await this.userRepository.findByNid(nid);

    if (!user) {
      user = User.create({ nid: nid });

      await this.userRepository.insert(user);
    }

    if (user.gameDbId === 0) {
      user.gameDbId = getGameDbIdFromUserId(user.id);
    }

    return user;
  }
}
