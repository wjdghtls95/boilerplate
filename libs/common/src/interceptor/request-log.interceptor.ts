import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;

        // latency error log
        if (responseTime > 3000) {
          Logger.error({
            labels: { Latency: context.getArgs()[0].url },
            contents: {
              body: context.getArgs()[0]?.body,
              time: `+${responseTime}ms`,
            },
          });
        }
      }),
    );
  }
}
