import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectService } from './project.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/Roles';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/user.decorator';

@ApiBearerAuth('JWT')
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('select_project')
  selectProject(@Request() req) {
    return req.role;
  }

  // @UseGuards(RolesGuard)
  // @RolesAllowed(Roles.ADMIN)
  @Post('add_project')
  addProject(@CurrentUser() usr) {
    return this.projectService.addProject(usr.id);
  }

  @Get('get_projects')
  async getProjects(@CurrentUser() usr) {
    return this.projectService.get_projects(usr.id);
  }

  @Get('get_projectfile/:theprojectId')
  getProjectfile(@Request() req) {
    return req.role;
  }

  @Get('get_projectinfo/:theprojectId')
  getProjectinfo(@Request() req) {
    return req.role;
  }
}
