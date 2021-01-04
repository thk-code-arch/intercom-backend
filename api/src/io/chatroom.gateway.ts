import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageDto, SwitchRoomDto } from './io.dto';
import { ChatService } from '../api/chat/chat.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'chatroom' })
export class ChatroomGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatroomGateway');

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket) {
    const { token } = client.handshake.query;
    if (!token) {
      this.logger.debug(`Disconnect: No Token provided`);
      return this.handleDisconnect(client);
    }
  }

  @SubscribeMessage('join_chatroom')
  async switchRoom(
    @MessageBody() req: SwitchRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    if (req.oldRoom !== 0) {
      socket.leave(String(req.oldRoom));
    }
    socket.join(String(req.newRoom));
    console.log('joines', req.newRoom, 'isIn', socket.rooms);
  }

  @SubscribeMessage('disconnet')
  async disconnect(@ConnectedSocket() socket: Socket) {
    socket.disconnect();
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() req: MessageDto) {
    if (req.chatroomId !== 0) {
      const res = await this.chatService.new_message(
        req.message,
        req.user.id,
        req.chatroomId,
      );
      this.server.in(String(req.chatroomId)).emit('message', res.id);
    }
  }
}
