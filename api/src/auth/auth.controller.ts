// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  SignupwithInvite,
  LoginUserDto,
  ResetPassword,
  SignupDemoAccount,
} from '../api/user/dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Body() signin: LoginUserDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async register(@Body() signupwithInvite: SignupwithInvite) {
    return this.authService.signup(signupwithInvite);
  }

  @Post('reset-password')
  async passwordReset(@Body() email: ResetPassword) {
    return this.authService.passwordReset(email.email);
  }

  @Post('signup-demo')
  async registerDemo(@Body() demosignup: SignupDemoAccount) {
    if (process.env.IC_DEMO === 'true') {
      return this.authService.createDemoAccount(demosignup.invitecode);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user.role;
  }
}
