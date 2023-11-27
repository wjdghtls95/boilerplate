import { applyDecorators, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../auth/guard/basic-auth.guard';
import { ApiBasicAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    UseGuards(BasicAuthGuard),
    ApiBasicAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
