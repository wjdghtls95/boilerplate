import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DefaultService {
  health(): Record<string, string> {
    return { environment: process.env.NODE_ENV };
  }
}
