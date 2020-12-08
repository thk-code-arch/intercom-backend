import { Module } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
import { AuthService } from './auth/auth.service';
import { ChatService } from './chat/chat.service';
import { FetchService } from './fetch/fetch.service';
import { FileService } from './file/file.service';
import { LearningService } from './learning/learning.service';
import { MaintenanceService } from './maintenance/maintenance.service';
import { ProjectService } from './project/project.service';
import { ViewService } from './view/view.service';
import { UserService } from './user/user.service';
import { AdminController } from './admin/admin.controller';
import { AuthController } from './auth/auth.controller';
import { ChatController } from './chat/chat.controller';
import { FetchController } from './fetch/fetch.controller';
import { FileController } from './file/file.controller';
import { LearningController } from './learning/learning.controller';
import { MaintenanceController } from './maintenance/maintenance.controller';
import { ProjectController } from './project/project.controller';
import { ViewController } from './view/view.controller';
import { UserController } from './user/user.controller';

@Module({
  providers: [AdminService, AuthService, ChatService, FetchService, FileService, LearningService, MaintenanceService, ProjectService, ViewService, UserService],
  controllers: [AdminController, AuthController, ChatController, FetchController, FileController, LearningController, MaintenanceController, ProjectController, ViewController, UserController]
})
export class EndpointsModule {}
