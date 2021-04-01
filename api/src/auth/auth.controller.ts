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
import { SignupwithInvite, LoginUserDto } from '../api/user/dto/user.dto';
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user.role;
  }
}
