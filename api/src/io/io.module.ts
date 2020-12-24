import { Module } from '@nestjs/common';
import { ChatroomGateway } from './chatroom.gateway';
import { IoService } from './io.service';
import { UserModule } from '../api/user/user.module';

@Module({
  imports: [UserModule],
  providers: [ChatroomGateway, IoService],
})
export class ioModule {}
