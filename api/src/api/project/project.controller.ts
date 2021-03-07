import {
  Controller,
  Res,
  Get,
  Post,
  Request,
  Header,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { ProjectService } from './project.service';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { ApiFile } from '../../auth/decorators/file.decorator';
import { addNewProject, selectProject, UpdateProject } from './project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, IFCFileFilter } from '../../utils/file-upload';
import * as fs from 'fs';

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

  @Post('edit_project')
  updateProject(
    @CurrentUser('id') usrid: number,
    @Body() editProject: UpdateProject,
  ) {
    return this.projectService.updateProject(usrid, editProject);
  }

  @Get('get_projects')
  async getProjects(@CurrentUser('id') usrid: number) {
    return this.projectService.get_projects(usrid);
  }

  @Get('get_projects_subprojects')
  async getProjectsAndSubprojects(@CurrentUser('id') usrid: number) {
    return this.projectService.get_projects_and_subprojects(usrid);
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
    console.log(file.filename);
    const upload = await this.projectService.uploadIFC(
      file.path,
      file.filename,
      usrid,
      projectid,
    );
    return {
      name: upload.filename,
      logfile: 'files/output/' + upload.filename.replace('.gltf', '.log'),
    };
  }

  @Get('get_projectfile/:theprojectId')
  @Header('Content-Type', 'model/gltf+json')
  async getProjectfile(
    @Param('theprojectId') pid: number,
    @CurrentUser('projects') project: number[],
    @Res() response,
  ) {
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

  @Get('get_projectinfo/:theprojectId')
  getProjectinfo(@CurrentUser('projects') project: number[], @Param() p) {
    return this.projectService.getProjectinfo(project, p.theprojectId);
  }
}
