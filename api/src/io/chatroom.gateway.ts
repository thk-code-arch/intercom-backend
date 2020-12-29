import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WsResponse,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { IoService } from './io.service';
import { MessageDto } from './message.dto';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'chatroom' })
export class ChatroomGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly ioservice: IoService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatroomGateway');

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, data) {}

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() req: MessageDto, payload: string) {
    console.log('handleclient', req);
    console.log('payload', payload);
    //skjsk
    //data.userid = socket.decoded_token.id;
    //data.time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    //// TODO check if User is allowed to post data in room.
    //if (data.chatroomId !== 0){
    //Chatlog.create(data).then(result =>{
    //  chatroom.in(data.chatroomId).emit('message', result.id);
    //});
    //}
    this.server.emit('message', payload);
  }
}
