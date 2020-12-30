import { Module } from '@nestjs/common';
import { ChatroomGateway } from './chatroom.gateway';
import { IoService } from './io.service';
import { ChatModule } from '../api/chat/chat.module';
import { UserModule } from '../api/user/user.module';

@Module({
  imports: [UserModule, ChatModule],
  providers: [ChatroomGateway, IoService],
})
export class ioModule {}
