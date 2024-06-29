import { BaseTimeDto } from '@libs/dao/base/time/dto/base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class AdminUserDto extends BaseTimeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: number;

  @Exclude()
  password: string;
}
