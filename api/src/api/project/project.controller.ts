// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Controller,
  Res,
  Get,
  Post,
  Header,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { ProjectService } from './project.service';
import { UtilsService } from '../../utils/utils.service';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { ApiFile } from '../../auth/decorators/file.decorator';
import {
  AddNewProject,
  SelectProject,
  UpdateProject,
  SelectProjectFile,
} from './project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, IFCFileFilter } from '../../utils/file-upload';
import * as fs from 'fs';

@Auth(Roles.USER)
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly utils: UtilsService,
  ) {}
  private readonly logger = new Logger(ProjectController.name);

  @Post('select_project')
  selectProject(
    @CurrentUser('projects') project: number[],
    @Body() sP: SelectProject,
  ) {
    return this.projectService.select_project(project, sP.projectid);
  }

  @Auth(Roles.ADMIN)
  @Post('add_project')
  addProject(
    @CurrentUser('id') usrid: number,
    @Body() newProject: AddNewProject,
  ) {
    return this.projectService.newProject(usrid, newProject);
  }

  @Auth(Roles.ADMIN)
  @Post('edit_project')
  updateProject(@Body() editProject: UpdateProject) {
    return this.projectService.updateProject(editProject);
  }

  @Auth(Roles.ADMIN)
  @Post('delete_subproject')
  deleteProject(@Body() deleteProject: SelectProject) {
    return this.projectService.deleteSubProject(deleteProject);
  }

  @Get('get_projects')
  async getProjects(@CurrentUser('projectsDetails') projects) {
    return projects;
  }

  @Post('uploadifc/:projectid')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/files/input',
        filename: editFileName,
      }),
      fileFilter: IFCFileFilter,
    }),
  )
  async uploadIFCFile(
    @UploadedFile() file,
    @CurrentUser('id') usrid: number,
    @Param('projectid') projectid: number,
  ) {
    const upload = await this.projectService.uploadIFC(
      file.path,
      file.filename,
      usrid,
      projectid,
    );

    const convert = await this.utils
      .convertIfc(file.filename.replace('.ifc', ''))
      .then((log) => {
        this.logger.log(log);
        return log;
      })
      .catch((error) => {
        this.logger.error(error);
        return error;
      });
    return {
      name: upload.filename,
      log: `ifc convert ${convert}`,
    };
  }

  @Get('get_projectfile/:projectId')
  @Header('Content-Type', 'model/gltf+json')
  async getProjectfile(
    @Param() pid: SelectProjectFile,
    @CurrentUser('projects') project: number[],
    @Res() response,
  ) {
    console.log(pid);
    const file = await this.projectService.getProjectfile(project, pid);
    const filepath = '/files/output/' + file.filename;
    fs.exists(filepath, function (exists) {
      if (exists) {
        return fs.createReadStream(filepath).pipe(response);
      } else {
        return;
      }
    });
  }

  @Get('get_projectfileifc/:projectId')
  @Header('Content-Type', 'application/octet-stream')
  async getProjectfileIfc(
    @Param() pid: SelectProjectFile,
    @CurrentUser('projects') project: number[],
    @Res() response,
  ) {
    const file = await this.projectService.getProjectfile(project, pid);
    const filepath = '/files/input/' + file.filename.replace('.glb', '.ifc');
    fs.exists(filepath, function (exists) {
      if (exists) {
        return fs.createReadStream(filepath).pipe(response);
      } else {
        return;
      }
    });
  }

  @Get('get_projectinfo/:theprojectId')
  getProjectinfo(@CurrentUser('projects') project: number[], @Param() p) {
    return this.projectService.getProjectinfo(project, p.theprojectId);
  }
}
