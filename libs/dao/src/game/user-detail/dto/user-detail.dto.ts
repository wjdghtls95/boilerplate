import { ApiProperty } from '@nestjs/swagger';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';

export class UserDetailDto extends ExcludeBaseTimeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  loginAt: Date;
}
