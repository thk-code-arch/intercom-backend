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
import {
  getPlayers,
  moveTo,
  SwitchRoomDto,
  Avatar,
  OnlineUsers,
} from './io.dto';
import _ = require('lodash');

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'viewport' })
export class ViewportGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatroomGateway');
  private onlineUsers = new OnlineUsers();

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
    if (this.onlineUsers[req.newRoom] == null) {
      this.onlineUsers[req.newRoom] = new Avatar();
    }

    if (req.oldRoom !== 0) {
      socket.leave(String(req.oldRoom));
    }

    socket.join(String(req.newRoom));
    //console.log('joines Viewport', req.newRoom, 'isIn', socket.rooms);
    this.onlineUsers[req.newRoom][req.user.id] = {
      userId: req.user.id,
      username: req.user.username,
      position: { x: 0, y: 0, z: 0, dir: { x: 0, y: 0, z: 0 } },
    };
    console.log('heeelllooo', this.onlineUsers);
  }

  @SubscribeMessage('disconnet')
  async disconnect(@ConnectedSocket() socket: Socket) {
    socket.disconnect();
  }

  @SubscribeMessage('moveTo')
  async sendMessage(@MessageBody() req: moveTo) {
    if (req.chatroomId !== 0) {
      if (
        this.onlineUsers[req.chatroomId] == null ||
        this.onlineUsers[req.chatroomId][req.user.id] == null
      ) {
        return;
      }
      this.onlineUsers[req.chatroomId][req.user.id] = {
        userId: req.user.id,
        username: req.user.username,
        position: req.position,
      };
      //this.server.in(String(req.chatroomId)).emit('getplayers', res);
      this.logger.debug(JSON.stringify(this.onlineUsers));
      this.server
        .in(String(req.chatroomId))
        .emit('getplayers', this.onlineUsers[req.chatroomId]);
    }
  }
}
