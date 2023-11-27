import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserNickNameInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickName: string;
}
