// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { ViewService } from './view.service';
import { ApiTags } from '@nestjs/swagger';
import { SelectProject, SelectedSubprojects } from './view.dto';

@Auth(Roles.USER)
@ApiTags('view')
@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get('get_selectedsubprojects/:projectId')
  async getSelectedSubprojects(
    @Param() projectId: SelectProject,
    @CurrentUser('projects') project: number[],
  ) {
    return this.viewService.getSelectedSubprojects(project, projectId);
  }

  @Get('get_manyselectedsubprojects/:projectId')
  async getManySelectedSubprojects(
    @Param() projectId: SelectProject,
    @CurrentUser('projects') project: number[],
  ) {
    return this.viewService.getManySelectedSubprojects(project, projectId);
  }

  @Post('set_selectedsubprojects')
  updateProject(
    @Body() selectedSubprojects: SelectedSubprojects,
    @CurrentUser('id') usrid: number,
  ) {
    return this.viewService.setSelectedSubprojects(selectedSubprojects, usrid);
  }
}
