import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UserModule } from './user/user.module';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';

@Module({
  controllers: [ApiController, ProjectController],
  imports: [UserModule, ProjectModule, ChatModule, AdminModule],
})
export class ApiModule {}
