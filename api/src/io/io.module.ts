import { Module } from '@nestjs/common';
import { ChatroomGateway } from './chatroom.gateway';
import { ViewportGateway } from './viewport.gateway';
import { IoService } from './io.service';
import { ChatModule } from '../api/chat/chat.module';
import { UserModule } from '../api/user/user.module';

@Module({
  imports: [UserModule, ChatModule],
  providers: [ViewportGateway, ChatroomGateway, IoService],
})
export class ioModule {}
