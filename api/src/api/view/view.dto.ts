// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Subprojects {
  id: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export class SelectedSubprojects {
  @ApiProperty()
  @IsArray()
  selectedSubprojects: Subprojects;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  projectId: number;
}

export class SelectProject {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  projectId: number;
}
