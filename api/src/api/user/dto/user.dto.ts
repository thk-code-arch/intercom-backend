// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  profile_image: string;

  invitecode: string;
  role: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class SignupwithInvite {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  invitecode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SignupDemoAccount {
  @ApiProperty()
  @IsNotEmpty()
  invitecode: string;
}

export class createIssue {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsNotEmpty()
  context: string;
}

export class SetPassword {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class ResetPassword {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class RegistrationStatus {
  success: boolean;
  message: string;
}

export class DemoRegistrationStatus {
  success: boolean;
  message: string;
  username: string;
  password: string;
}

export class PasswordResetStatus {
  email: string;
  username: string;
  newPassword: string;
}

export class UpdateUserProfile {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserImage {
  @ApiProperty()
  @IsNotEmpty()
  baseUrl: string;
}
