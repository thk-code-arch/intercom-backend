import { IsNumber, IsString, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUsersByEmail {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  email?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  newUsers?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
