import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminService } from './admin/admin.service';
import { ChatService } from './chat/chat.service';
import { FetchService } from './fetch/fetch.service';
import { FileService } from './file/file.service';
import { LearningService } from './learning/learning.service';
import { MaintenanceService } from './maintenance/maintenance.service';
import { ProjectService } from './project/project.service';
import { ViewService } from './view/view.service';
import { UserService } from './user/user.service';
import { LoginService } from './login/login.service';
import { AdminController } from './admin/admin.controller';
import { LoginController } from './login/login.controller';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat/chat.controller';
import { FetchController } from './fetch/fetch.controller';
import { FileController } from './file/file.controller';
import { LearningController } from './learning/learning.controller';
import { MaintenanceController } from './maintenance/maintenance.controller';
import { ProjectController } from './project/project.controller';
import { ViewController } from './view/view.controller';
import { UserController } from './user/user.controller';

import { User } from '../db/models/user.entity';

@Module({
	imports: [AuthModule,TypeOrmModule.forFeature([User])],
  providers: [AdminService,  ChatService, FetchService, FileService,LoginService, LearningService, MaintenanceService, ProjectService, ViewService, UserService],
  controllers: [AdminController, LoginController , ChatController, FetchController, FileController, LearningController, MaintenanceController, ProjectController, ViewController, UserController],
	exports: [LoginService]
})
export class EndpointsModule {}
