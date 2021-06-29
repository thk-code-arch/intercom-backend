// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { UtilsModule } from '../../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import {
  User,
  Project,
  Chatroom,
  Projectfile,
} from '../../database/entities/models';

@Module({
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([User, Project, Chatroom, Projectfile]),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
