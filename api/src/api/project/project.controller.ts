import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {

  @Get('get_projects')
  getProjects(@Request() req) {
    return req.role;
  }

}
