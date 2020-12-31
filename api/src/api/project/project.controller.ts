import { Controller, Get, Post, Request, Param, Body } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { ProjectService } from './project.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { addNewProject, selectProject } from './project.dto';

@Auth(Roles.USER)
@ApiTags('project')
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

  @Auth(Roles.ADMIN)
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
  getProjectinfo(@CurrentUser('projects') project: number[], @Param() p) {
    return this.projectService.getProjectinfo(project, p.theprojectId);
  }
}
