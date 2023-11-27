import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginInDto {
  @ApiProperty()
  @IsString()
  nid: string;
}
