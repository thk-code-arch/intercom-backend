// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../Roles';
import _ = require('lodash');

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const methodRoles =
      this.reflector.get<Roles[]>('roles', context.getHandler()) || [];
    const classRoles =
      this.reflector.get<Roles[]>('roles', context.getClass()) || [];

    if (!methodRoles && !classRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const allRoles = [...methodRoles, ...classRoles];

    const resp = _.map(request.user.roles, 'id').includes(allRoles[0]);
    return resp;
  }
}
