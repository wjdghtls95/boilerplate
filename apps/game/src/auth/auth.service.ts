import { Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { SessionRepository } from '@libs/dao/redis/session/session.repository';
import { TimeUtil } from '@libs/common/utils/time.util';

@Injectable()
export class AuthService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async validateSession(userId: number, sessionId: string): Promise<boolean> {
    if (!userId || !sessionId) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.SESSION_NOT_EXIST_USER_ID_IN_HEADER,
      );
    }

    const session = await this.sessionRepository.getSession(userId.toString());

    if (!session) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_NOT_FOUND);
    } else if (session.id !== sessionId) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.SESSION_RE_LOGIN);
    }

    ContextProvider.setSession(session);
    ContextProvider.setNow(TimeUtil.now());

    return true;
  }
}
