import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { StorageService } from './storage.service';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ApiFile } from '../../auth/decorators/file.decorator';
import { UploadProjectScreenshot } from './storage.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageExtensionFilter } from '../../utils/img-upload';

@Auth(Roles.USER)
@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/files/storage/screenshots',
        filename: editFileName,
      }),
      fileFilter: imageExtensionFilter,
    }),
  )
  @Post('upload_project_screenshot')
  async uploadProjectScreenshot(
    @Body() body: UploadProjectScreenshot,
    @UploadedFile() file,
    @CurrentUser('id') usrid: number,
  ) {
    console.log(body);
    return this.storageService.uploadProjectScreenshot(
      file.path,
      file.filename,
      usrid,
      body,
    );
  }

  @Get('get_project_screenshot/:theprojectId')
  async getProjectfile(
    @Param('theprojectId') pid: number,
    @CurrentUser('projects') project: number[],
  ) {
    return this.storageService.getAllProjectScreenshots(project, pid);
  }
}
