import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UserModule } from './user/user.module';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';

@Module({
  controllers: [ApiController, ProjectController],
  imports: [UserModule, ProjectModule]
})
export class ApiModule {}
