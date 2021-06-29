// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoUrl {
  @ApiProperty()
  @IsString()
  scrapeUrl: string;
}

export enum category {
  Link = 'Link',
  File = 'File',
  Video = 'Video',
  Pdf = 'Pdf',
}

export enum access {
  Public = 'PUBLIC',
  Project = 'PROJECT',
  Private = 'PRIVATE',
}

export class NewLearning {
  @ApiProperty()
  @IsEnum(category)
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(access)
  type: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  projectId?: number;
}

export class FetchVideo {
  @ApiProperty()
  @IsString()
  scrapeUrl: string;
}
