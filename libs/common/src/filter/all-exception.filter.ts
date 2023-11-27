import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseEntity } from '@libs/common/network/response-entity';
import * as Sentry from '@sentry/node';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  logger: Logger;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.logger = new Logger('HTTP EXCEPTION');
  }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error =
      exception instanceof HttpException || exception?.response
        ? exception?.response
        : exception?.error ?? undefined;

    const message = error
      ? ServerErrorException.errorCodeToString(error)
      : undefined;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      error: error,
      message: message,
    };

    if (
      responseBody.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR &&
      typeof responseBody.error === 'number'
    ) {
      const body = ResponseEntity.error(
        responseBody.error,
        responseBody.message,
      );
      httpAdapter.reply(ctx.getResponse(), body, HttpStatus.OK);
    } else {
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }

    const request = {
      method: responseBody.path,
      headers: ctx.getRequest()['headers'],
      body: ctx.getRequest()['body'],
    };
    this.logger.error({ ...exception, request: request }, exception.stack);

    Sentry.captureException(exception);
  }
}
