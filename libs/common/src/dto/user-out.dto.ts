import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@libs/dao/common/user/dto/user.dto';
import { UserDetailDto } from '@libs/dao/game/user-detail/dto/user-detail.dto';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class UserOutDto extends BaseOutDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: UserDetailDto })
  userDetail: UserDetailDto;
}
