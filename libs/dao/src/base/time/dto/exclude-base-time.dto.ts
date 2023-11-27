import { Exclude } from 'class-transformer';
import { BaseDto } from '@libs/dao/base/base.dto';

export class ExcludeBaseTimeDto extends BaseDto {
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
