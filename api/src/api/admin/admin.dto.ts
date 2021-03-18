import {
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUsersByEmail {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  newUsers?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
