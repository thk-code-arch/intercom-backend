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
      chatrooms: _.map(user.chatrooms, 'id'),
    };
    return data ? req?.[data] : req;
  },
);
