// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Injectable,
  ExecutionContext,
  Logger,
  CanActivate,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';
import _ = require('lodash');

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthService.name);
  async canActivate(context: ExecutionContext) {
    const { token } = context.switchToWs().getClient().handshake.query;

    if (!token) {
      this.logger.error('no token');
      throw new WsException('Auth Error!');
    }

    const {
      id,
      username,
      profile_image,
      roles,
      projects,
      chatrooms,
    } = await this.authService.getUserDatafromJWT(token);
    //TODO : get all subprojects, so users were assingned automatticly.

    if (!id) {
      this.logger.error('no user');
      throw new WsException('Auth Error!');
    }

    context.switchToWs().getData().user = {
      id,
      username,
      profile_image,
      roles: _.map(roles, 'id'),
      projects: _.map(projects, 'id'),
      chatrooms: _.map(chatrooms, 'id'),
    };

    return Boolean(id);
  }
}
