import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, mergeMap } from 'rxjs';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';

@Injectable()
export class UserLevelLockInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(async (e) => {
        await this.release();

        throw e;
      }),

      mergeMap(async (res) => {
        await this.release();

        return res;
      }),
    );
  }

  async release(): Promise<void> {
    const session = ContextProvider.getSession();

    if (!session) {
      return;
    }

    const { userId, database } = session;

    const queryRunners = ContextProvider.getQueryRunners();

    if (queryRunners) {
      await queryRunners[database]?.query(`SELECT RELEASE_LOCK('${userId}');`);

      await TypeOrmHelper.releases(Object.values(queryRunners));

      ContextProvider.releaseQueryRunner();
    }
  }
}
