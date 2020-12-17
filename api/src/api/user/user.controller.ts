import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';

@Controller('user')
export class UserController {

 constructor(private readonly authService: AuthService) {}


  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  getProfile(@Request() req) {
    return req.user;
  }


}
