// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { Socket, Server } from 'socket.io';
import {
  moveTo,
  SwitchRoomDto,
  LeaveViewport,
  Avatar,
  lastSendInRoom,
  OnlineUsers,
} from './io.dto';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'viewport' })
export class ViewportGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatroomGateway');
  private onlineUsers = new OnlineUsers();
  private lastSent = new lastSendInRoom();

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
      this.lastSent[req.newRoom] = new Date();
    }

    if (req.oldRoom !== 0) {
      socket.leave(String(req.oldRoom));
      delete this.onlineUsers[req.oldRoom][req.user.id];
    }

    socket.join(String(req.newRoom));
    this.onlineUsers[req.newRoom][req.user.id] = {
      userId: req.user.id,
      username: req.user.username,
      profile_image: req.user.profile_image,
      position: { x: 0, y: 0, z: 0, dir: { x: 0, y: 0, z: 0 } },
    };
  }

  @SubscribeMessage('disconnect')
  async disconnect(
    @MessageBody() req: LeaveViewport,
    @ConnectedSocket() socket: Socket,
  ) {
    if (req.projectId !== 0) {
      socket.leave(String(req.projectId));
      delete this.onlineUsers[req.projectId][req.user.id];
    }
    //TODO handle disconnect
  }

  async sendToAll(msg: string) {
    this.logger.log('fire message');
    this.server.emit('alertToClient', { message: msg, type: 'Alert' });
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
        profile_image: req.user.profile_image,
        position: req.position,
      };
      // throttle emits
      const timeDelta = Math.abs(
        new Date().getTime() - this.lastSent[req.chatroomId].getTime(),
      );
      if (timeDelta >= 500) {
        this.lastSent[req.chatroomId] = new Date();
        this.server.in(String(req.chatroomId)).emit('getplayers', {
          projectId: req.chatroomId,
          pos: this.onlineUsers[req.chatroomId],
        });
      }
    }
  }
}
