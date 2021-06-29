// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Controller, Res, Get, Header, Param } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { AvatarService } from './avatar.service';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';

@Auth(Roles.USER)
@ApiTags('avatar')
@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get('get_avatarfile/:theavatarId')
  @Header('Content-Type', 'model/gltf+json')
  async getAvatarfile(@Param('theavatarId') avatarId: number, @Res() response) {
    const file = await this.avatarService.getAvatarfile(avatarId);
    const filepath = '/files/avatars/' + file.filename;
    fs.exists(filepath, function (exists) {
      if (exists) {
        return fs.createReadStream(filepath).pipe(response);
      } else {
        return;
      }
    });
  }
}
