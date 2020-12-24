import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor() {}

  @Get('whoami')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('amiuser')
  @Auth(Roles.USER)
  getAdmin(@Request() req) {
    return req.user;
  }

  @Get('amiadmin')
  @Auth(Roles.ADMIN)
  getRoot(@Request() req) {
    return req.user;
  }
}
