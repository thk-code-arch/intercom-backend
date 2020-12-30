import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import {
  User,
  Project,
  Chatroom,
  Projectfile,
} from '../../database/entities/models';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Chatroom, Projectfile])],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
