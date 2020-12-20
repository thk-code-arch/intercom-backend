import { Module } from '@nestjs/common';
import { ChatroomGateway } from './chatroom.gateway';

@Module({
  providers: [ChatroomGateway]
})
export class ioModule {}
