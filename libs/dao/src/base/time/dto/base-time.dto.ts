import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@libs/dao/base/base.dto';

export class BaseTimeDto extends BaseDto {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
