import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Project, Chatroom } from '../../database/entities/models';
@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Chatroom])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
