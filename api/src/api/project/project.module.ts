import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { MulterModule } from '@nestjs/platform-express';
import {
  User,
  Project,
  Chatroom,
  Projectfile,
} from '../../database/entities/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, Chatroom, Projectfile]),
    MulterModule.register({
      dest: './files/input',
    }),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
