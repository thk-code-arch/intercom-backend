import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { AvatarModule } from './avatar/avatar.module';
import { LearningModule } from './learning/learning.module';
import { StorageModule } from './storage/storage.module';

@Module({
  controllers: [ApiController],
  imports: [
    AvatarModule,
    AdminModule,
    ChatModule,
    LearningModule,
    ProjectModule,
    StorageModule,
    UserModule,
  ],
})
export class ApiModule {}
