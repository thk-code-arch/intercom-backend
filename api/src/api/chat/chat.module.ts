import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Chatlog } from '../../database/entities/models';
@Module({
  imports: [TypeOrmModule.forFeature([User, Chatlog])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
