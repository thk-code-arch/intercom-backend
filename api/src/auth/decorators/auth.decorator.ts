// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { Roles } from '../Roles';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth('JWT'),
    ApiUnauthorizedResponse({ description: 'Unauthorized, AuthDecorator' }),
  );
}
