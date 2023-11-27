import { Controller, Get } from '@nestjs/common';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { GameService } from './game.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { INTERNAL_ERROR_CODE_DESC } from '@libs/common/constants/internal-error-code-desc.constants';
import Redis from 'ioredis';

@Controller('/')
export class GameController {
  redis: Redis;

  constructor(private readonly gameService: GameService) {
    this.redis;
  }

  @Get('health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<unknown> {
    const result = this.gameService.health();

    return ResponseEntity.ok().body(result);
  }

  @Get('/error/code')
  @ApiResponseEntity({ summary: 'internal error code' })
  getInternalErrorCodes(): ResponseEntity<Record<string, string>> {
    const results = Object.fromEntries(
      Object.keys(INTERNAL_ERROR_CODE).map((key) => {
        const value = INTERNAL_ERROR_CODE[key];
        const desc = INTERNAL_ERROR_CODE_DESC[value];
        return [`code(${value})`, `${key} - ${desc}`];
      }),
    );

    return ResponseEntity.ok().body(results);
  }
}
