import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base.time.dto';

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
