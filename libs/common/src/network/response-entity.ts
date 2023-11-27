import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as process from 'process';
import { INTERNAL_ERROR_CODE_DESC } from '@libs/common/constants/internal-error-code-desc.constants';

class BodyBuilder {
  private readonly _code: number;
  private _body: any | any[];

  constructor(code: number) {
    this._code = code;
  }

  body<T>(body: T): ResponseEntity<T>;
  body<T>(body: T[]): ResponseEntity<T[]>;
  body<T>(body: T | T[]): ResponseEntity<T | T[]> {
    this._body = body;
    return new ResponseEntity<T>(this._code, this._body);
  }

  build<T>(): ResponseEntity<T> {
    return new ResponseEntity(this._code, this._body);
  }
}

export class ResponseEntity<T> {
  @ApiProperty() private code: number;
  @ApiPropertyOptional() private data?: T | T[];
  @ApiPropertyOptional() private payLoad?: object;
  @ApiPropertyOptional() private message?: string;

  constructor(
    code: number,
    body?: T | T[],
    message?: string,
    payLoad?: object,
  ) {
    this.code = code;
    this.data = body;
    this.message = message;
    this.payLoad = payLoad;
  }

  static ok(): BodyBuilder;
  static ok<T>(body: T): ResponseEntity<T>;
  static ok<T>(body: T[]): ResponseEntity<T[]>;
  static ok<T>(body?: T | T[]): ResponseEntity<T | T[]> | BodyBuilder {
    return body ? new ResponseEntity(0, body) : new BodyBuilder(0);
  }

  static error<T>(code = 99999, message = 'Unknown Error'): ResponseEntity<T> {
    if (process.env.NODE_ENV !== 'prod') {
      message = `${message} (${INTERNAL_ERROR_CODE_DESC[code]})`;
    }
    return new ResponseEntity<T>(code, undefined, message);
  }
}
