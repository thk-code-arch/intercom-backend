import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User, Project, Chatroom } from '../../database/entities/models';
@Module({
  imports: [
    UserModule,
    UtilsModule,
    TypeOrmModule.forFeature([User, Role, Project, Chatroom]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
