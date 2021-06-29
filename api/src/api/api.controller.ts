// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/Roles';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';

@Auth(Roles.USER)
@ApiTags('api')
@Controller('')
export class ApiController {
  @Get('changelog')
  async changelog() {
    const path = '/app/CHANGELOG.md';
    const resp = fs.readFileSync(path, 'utf8');
    return resp;
  }
}
