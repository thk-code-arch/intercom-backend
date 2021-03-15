import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class videoUrl {
  @ApiProperty()
  @IsString()
  scrapeUrl: string;
}
export class NewLearning {
  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNumber()
  thumbnail?: string;

  @ApiProperty()
  @IsNumber()
  title: string;

  @ApiProperty()
  @IsNumber()
  type: string;

  @ApiProperty()
  @IsNumber()
  projectId?: number;
}

export class FetchVideo {
  @ApiProperty()
  @IsString()
  scrapeUrl: string;
}
