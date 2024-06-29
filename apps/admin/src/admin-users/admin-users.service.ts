import { Inject, Injectable } from '@nestjs/common';
import { AdminUserRepository } from '@libs/dao/admin/admin-user/admin-user.repository';
import { SignupAdminUserInDto } from './dto/signup-admin-user-in.dto';
import { AdminUserDto } from '@libs/dao/admin/admin-user/dto/admin-user.dto';
import { AdminUser } from '@libs/dao/admin/admin-user/admin-user.entity';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { hash } from 'bcrypt';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';

@Injectable()
export class AdminUsersService {
  constructor(
    @Inject(AdminUserRepository)
    private readonly adminUserRepository: AdminUserRepository,
  ) {}

  /**
   * 이메일 중복 확인
   */
  async isDuplicated(email: string): Promise<void> {
    const findAdminUser = await this.adminUserRepository.findByEmail(email);

    if (findAdminUser) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.ADMIN_USER_CONFLICT_EMAIL,
      );
    }
  }

  /**
   * 어드민 유저 가입
   */
  async signup(
    signUpAdminUserInDto: SignupAdminUserInDto,
  ): Promise<AdminUserDto> {
    // check duplicate
    await this.isDuplicated(signUpAdminUserInDto.email);

    const adminUser = AdminUser.create({
      email: signUpAdminUserInDto.email,
      password: await hash(signUpAdminUserInDto.password, 10),
    });

    await this.adminUserRepository.insert(adminUser);

    return AdminUserDto.fromEntity(adminUser);
  }
}
