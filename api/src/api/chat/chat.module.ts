import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Project,
  Chatlog,
  Chatroom,
} from '../../database/entities/models';
@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Chatroom, Chatlog])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
