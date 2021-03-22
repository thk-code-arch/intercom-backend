import {
  Controller,
  Post,
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
import { UploadEncImage } from './storage.dto';
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
  @Post('upload_enc_image')
  async uploadEncImage(@Body() body: UploadEncImage, @UploadedFile() file) {
    console.log(body.description);
    return this.storageService.createThumbnail(file.path, file.filename);
  }
}
