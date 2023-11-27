import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class LoginOutDto extends BaseOutDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  serverTimeDate: Date;
}
