import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewProject {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  owner?: number;
  @IsNumber()
  parentProject?: number;
}
export class addNewProject {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  description: string;
}
