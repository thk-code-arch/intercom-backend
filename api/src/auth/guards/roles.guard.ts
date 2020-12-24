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
    console.log(allRoles);
    console.log(_.map(request.user.roles, 'id'));
    console.log(resp);
    return resp;
  }
}
