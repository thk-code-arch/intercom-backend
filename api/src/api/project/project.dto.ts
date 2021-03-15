import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NewProject {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  owner?: number;

  @IsNumber()
  @Type(() => Number)
  parentProject?: number;
}

export class UpdateProject {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  id: number;
}

export class addNewProject {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parentProject?: number;
}
export class selectProject {
  @ApiProperty()
  @IsNumber()
  projectid: number;
}
