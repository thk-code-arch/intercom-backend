// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { AvatarModule } from './avatar/avatar.module';
import { LearningModule } from './learning/learning.module';
import { StorageModule } from './storage/storage.module';
import { ViewModule } from './view/view.module';

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
    ViewModule,
  ],
})
export class ApiModule {}
