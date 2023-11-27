import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginInDto } from './dto/login-in.dto';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { LoginOutDto } from './dto/login-out.dto';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';
import { Auth } from '../decorator/auth.decorator';

@Controller('login')
@ApiTags('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/')
  @ApiResponseEntity({ type: LoginOutDto, summary: '로그인 by nid' })
  async login(
    @Body() loginInDto: LoginInDto,
  ): Promise<ResponseEntity<LoginOutDto>> {
    const loginOutDto = await this.loginService.login(loginInDto);

    return ResponseEntity.ok().body(loginOutDto);
  }

  @Post('/session/refresh')
  @ApiResponseEntity({ type: LoginOutDto, summary: 'session 갱신' })
  @Auth()
  async refreshSession(): Promise<ResponseEntity<LoginOutDto>> {
    const loginOutDto = await this.loginService.refreshSession();

    return ResponseEntity.ok().body(loginOutDto);
  }
}
