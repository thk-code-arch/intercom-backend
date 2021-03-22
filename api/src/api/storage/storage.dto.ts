import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadEncImage {
  @ApiProperty()
  @IsString()
  description: string;
}
