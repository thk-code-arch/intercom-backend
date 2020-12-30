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
import { AuthService } from '../auth/auth.service';
import { ChatService } from '../api/chat/chat.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'chatroom' })
export class ChatroomGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) {}
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
    socket.join(String(req.newRoom));
  }

  @SubscribeMessage('disconnet')
  async disconnect(@ConnectedSocket() socket: Socket) {
    socket.disconnect();
  }

  @SubscribeMessage('send_message')
  async sendMessage(@MessageBody() req: MessageDto) {
    const res = await this.chatService.new_message(req.message, req.user.id, 2);
    this.server.emit('message', res.id);
  }
}
