import { IsNumber, Length, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NewProject {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(3, 320)
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
  @Length(3, 100)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(3, 320)
  description: string;

  @ApiProperty()
  @IsNumber()
  id: number;
}

export class AddNewProject {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(3, 320)
  description: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parentProject?: number;
}
export class SelectProject {
  @ApiProperty()
  @IsNumber()
  projectid: number;
}
