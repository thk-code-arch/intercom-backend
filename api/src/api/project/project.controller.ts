import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectService } from './project.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/Roles';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { addNewProject, selectProject } from './project.dto';

@ApiBearerAuth('JWT')
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('select_project')
  selectProject(
    @CurrentUser('projects') project: number[],
    @Body() sP: selectProject,
  ) {
    return this.projectService.select_project(project, sP.projectid);
  }

  //  @UseGuards(RolesGuard)
  //  @RolesAllowed(Roles.ADMIN)
  @Post('add_project')
  addProject(
    @CurrentUser('id') usrid: number,
    @Body() newProject: addNewProject,
  ) {
    return this.projectService.newProject(usrid, newProject);
  }

  @Get('get_projects')
  async getProjects(@CurrentUser('id') usrid: number) {
    return this.projectService.get_projects(usrid);
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
