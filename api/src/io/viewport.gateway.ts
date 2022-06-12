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
import { AuthService } from '../auth/auth.service';
import {
  moveTo,
  SwitchRoomDto,
  LeaveViewport,
  Avatar,
  lastSendInRoom,
  OnlineUsers,
} from './io.dto';
import _ = require('lodash');
import { ObjectIdColumn } from 'typeorm';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'viewport' })
export class ViewportGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ViewportGateway');
  private onlineUsers = new OnlineUsers();
  private lastSent = new lastSendInRoom();

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async joinRoom(
    @ConnectedSocket() socket: Socket,
    newRoom: number,
    oldRoom: number,
    user: any,
  ) {
    console.log('thisroom', this.onlineUsers[newRoom], oldRoom, newRoom);
    if (!this.onlineUsers[newRoom]) {
      console.log('create new room');
      this.onlineUsers[newRoom] = new Avatar();
      this.lastSent[newRoom] = new Date();
    }

    const foundOldroom = Object.keys(this.onlineUsers).find(
      (k) => this.onlineUsers[k][user.id],
    );
    console.log(foundOldroom);

    if (Number(foundOldroom)) {
      console.log('leaveOldroom');
      socket.leave(String(foundOldroom));
      delete this.onlineUsers[foundOldroom][user.id];
    }

    socket.join(String(newRoom));
    this.onlineUsers[newRoom][user.id] = {
      userId: user.id,
      username: user.username,
      profile_image: user.profile_image,
      position: { x: 0, y: 0, z: 0, dir: { x: 0, y: 0, z: 0 } },
    };
    console.log(this.onlineUsers);
    console.log(socket.rooms);
  }

  async handleConnection(client: Socket) {
    const { token, projectId } = client.handshake.query;
    if (!token) {
      this.logger.debug(`Disconnect: No Token provided`);
      return this.handleDisconnect(client);
    }

    const { id, username, profile_image, roles, projects, chatrooms } =
      await this.authService.getUserDatafromJWT(token);
    const user = {
      id,
      username,
      profile_image,
      roles: _.map(roles, 'id'),
      projects: _.map(projects, 'id'),
      chatrooms: _.map(chatrooms, 'id'),
    };
    await this.joinRoom(client, Number(projectId), Number(projectId), user);
  }

  @SubscribeMessage('join_viewport')
  async switchRoom(
    @MessageBody() req: SwitchRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.joinRoom(socket, req.newRoom, req.oldRoom, req.user);
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
    //TODO handle disconnectn
  }

  async sendInViewport(msg: string, action: string, projectId: number) {
    console.log(this.onlineUsers);

    this.server.in(String(projectId)).emit('update', {
      message: msg,
      action: action,
    });
  }

  @SubscribeMessage('moveTo')
  async sendMessage(@MessageBody() req: moveTo) {
    if (req.chatroomId !== 0) {
      this.logger.log(req.chatroomId);
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
