// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { SetMetadata } from '@nestjs/common';
import { Roles } from '../Roles';

export const RolesAllowed = (...roles: Roles[]) => SetMetadata('roles', roles);
