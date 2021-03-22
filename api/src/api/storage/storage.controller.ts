import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { StorageService } from './storage.service';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ApiFile } from '../../auth/decorators/file.decorator';
import { UploadEncImage } from './storage.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageExtensionFilter } from '../../utils/img-upload';

@Auth(Roles.USER)
@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload_enc_image')
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
  async uploadEncImage(@UploadedFile() file) {
    console.log('UUUPLLADD');
    console.log(file);
    return {
      file: file.buffer,
    };
  }
}
