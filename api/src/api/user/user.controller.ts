// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Body,
  Get,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import {
  UpdateUserImage,
  UpdateUserProfile,
  createIssue,
  SetPassword,
} from './dto/user.dto';
import { UtilsService } from '../../utils/utils.service';
import { UserService } from './user.service';
import { CurrentUser } from '../../auth/decorators/user.decorator';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ApiFile } from '../../auth/decorators/file.decorator';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { profileImage, imageExtensionFilter } from '../../utils/upload';

@ApiTags('user')
@Auth(Roles.USER)
@Controller('user')
export class UserController {
  constructor(
    private readonly utils: UtilsService,
    private readonly user: UserService,
  ) {}

  @Post('create_issue')
  async createIssue(@Body() issue: createIssue) {
    return this.utils.createIssue(issue);
  }

  @Post('update_password')
  async updatePassword(
    @Body() passw: SetPassword,
    @CurrentUser('id') usrId: number,
  ) {
    return this.user.setPassword(usrId, passw.newPassword);
  }

  @Post('update_profile')
  async updateProfile(
    @Body() updateUser: UpdateUserProfile,
    @CurrentUser('id') usrId: number,
  ) {
    return this.user.updateProfile(usrId, updateUser);
  }

  @Get('get_profile')
  async getProfile(@CurrentUser('id') usrId: number) {
    return this.user.getProfile(usrId);
  }

  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '/files/p_img',
        filename: profileImage,
      }),
      fileFilter: imageExtensionFilter,
    }),
  )
  @Post('upload_profile_image')
  async uploadUserImageProfile(
    @Body() uploadPimage: UpdateUserImage,
    @UploadedFile() file,
    @CurrentUser('id') usrid: number,
  ) {
    return this.user.updateProfileImage(
      usrid,
      `${uploadPimage.baseUrl}${file.path}`,
    );
  }
}
