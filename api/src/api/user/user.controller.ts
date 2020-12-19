import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles } from '../../auth/Roles';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {

 constructor() {}

  @Get('whoami')
  getProfile(@Request() req) {
    return req.role;
  }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles.USER)
  @Get('amiuser')
  getAdmin(@Request() req) {
    return req.user;
  }

  @UseGuards(RolesGuard)
  @RolesAllowed(Roles.ADMIN)
  @Get('amiadmin')
  getRoot(@Request() req) {
    return req.user;
  }

}
