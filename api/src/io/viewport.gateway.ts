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
import { getPlayers, moveTo, SwitchRoomDto } from './io.dto';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'viewport' })
export class ViewportGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}
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

  @SubscribeMessage('join_viewport')
  async switchRoom(
    @MessageBody() req: SwitchRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    if (req.oldRoom !== 0) {
      socket.leave(String(req.oldRoom));
    }
    socket.join(String(req.newRoom));
    console.log('joines Viewport', req.newRoom, 'isIn', socket.rooms);
    this.server
      .of('/viewport')
      .in(String(req.newRoom))
      .clients(function (error, clients) {
        console.log('theClientsError', error);
        console.log('theClients', clients);
      });
  }

  @SubscribeMessage('disconnet')
  async disconnect(@ConnectedSocket() socket: Socket) {
    socket.disconnect();
  }

  @SubscribeMessage('moveTo')
  async sendMessage(@MessageBody() req: moveTo) {
    if (req.chatroomId !== 0) {
      const res = new getPlayers();
      res.position = req.position;
      res.chatroomId = req.chatroomId;
      res.userId = req.user.id;
      res.username = req.user.username;
      res.profile_image = req.user.profile_image;
      this.server.in(String(req.chatroomId)).emit('getplayers', res);
    }
  }
}
