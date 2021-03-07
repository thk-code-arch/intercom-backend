import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../../auth/auth.module';
import { ProjectModule } from '../project/project.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    ProjectModule,
    ChatModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
