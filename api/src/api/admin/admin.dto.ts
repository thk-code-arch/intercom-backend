import { IsEmail, IsString, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUsersByEmail {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  //  @IsEmail()
  email: string;
}