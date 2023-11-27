import { ApiProperty } from '@nestjs/swagger';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { Exclude } from 'class-transformer';

export class UserDto extends ExcludeBaseTimeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nid: string;

  @ApiProperty()
  nickName: string;

  @Exclude()
  gameDbId: number;
}
