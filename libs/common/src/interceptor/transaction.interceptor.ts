import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, mergeMap } from 'rxjs';
import { TypeOrmHelper } from '@libs/common/database/typeorm/typeorm.helper';
import { ContextProvider } from '@libs/common/provider/context.provider';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      // exception
      catchError(async (e) => {
        const queryRunners = ContextProvider.getQueryRunners();

        if (queryRunners) {
          const runners = Object.values(queryRunners).filter(
            (it) => it.isTransactionActive,
          );
          await TypeOrmHelper.rollbackTransactions(runners);
        }

        throw e;
      }),

      // execute
      mergeMap(async (res) => {
        const queryRunners = ContextProvider.getQueryRunners();

        if (queryRunners) {
          const runners = Object.values(queryRunners).filter(
            (it) => it.isTransactionActive,
          );
          await TypeOrmHelper.commitTransactions(runners);
        }

        return res;
      }),
    );
  }
}
