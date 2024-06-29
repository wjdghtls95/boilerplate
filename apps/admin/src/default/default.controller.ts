import { Controller, Get } from '@nestjs/common';
import { DefaultService } from './default.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('default')
export class DefaultController {
  constructor(private readonly adminService: DefaultService) {}

  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<Record<string, string>> {
    const health = this.adminService.health();
    return ResponseEntity.ok().body(health);
  }
}
