import { InternalServerErrorException } from '@nestjs/common';
import {
  INTERNAL_ERROR_CODE,
  InternalErrorCode,
} from '@libs/common/constants/internal-error-code.constants';

export class ServerErrorException extends InternalServerErrorException {
  constructor(errorCode: InternalErrorCode, errorMessage?: string) {
    super(
      errorCode,
      errorMessage || ServerErrorException.errorCodeToString(errorCode),
    );
  }

  static errorCodeToString(errorCode: InternalErrorCode): string {
    const codeName = Object.keys(INTERNAL_ERROR_CODE).find(
      (key) => INTERNAL_ERROR_CODE[key] === errorCode,
    );

    return codeName || 'ERROR_CODE_UNKNOWN';
  }
}
