// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import _ = require('lodash');
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const req = {
      id: user.id,
      username: user.username,
      profile_image: user.profile_image,
      roles: _.map(user.roles, 'id'),
      projects: _.map(user.projects, 'id'),
      projectsDetails: user.projects,
      chatrooms: _.map(user.chatrooms, 'id'),
      chatroomsDetails: user.chatrooms,
    };
    return data ? req?.[data] : req;
  },
);
