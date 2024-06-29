import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';
import { AdminUserDto } from '@libs/dao/admin/admin-user/dto/admin-user.dto';
import { SignupAdminUserInDto } from './dto/signup-admin-user-in.dto';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { AdminUsersService } from './admin-users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin-users')
@ApiTags('admin-users')
export class AdminUsersController {
  constructor(private readonly adminUserService: AdminUsersService) {}

  @Post()
  @ApiResponseEntity({ type: AdminUserDto, summary: '어드민 페이지 가입' })
  async create(
    @Body() signupAdminUserInDto: SignupAdminUserInDto,
  ): Promise<ResponseEntity<AdminUserDto>> {
    const adminUserDto =
      await this.adminUserService.signup(signupAdminUserInDto);

    return ResponseEntity.ok().body(adminUserDto);
  }
}
