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

  async handleConnection(client: Socket) {
    const { token, projectId } = client.handshake.query;
    if (!token) {
      this.logger.debug(`Disconnect: No Token provided`);
      return this.handleDisconnect(client);
    }

    const user = await this.getUser(token);
    await this.joinRoom(client, Number(projectId), 'handleConnection', user);
  }

  async handleDisconnect(client: Socket) {
    const { token } = client.handshake.query;
    if (token) {
      const user = await this.getUser(token);
      this.logger.log(`User disconnected: ${user.username}`);
      Object.keys(this.onlineUsers)
        .filter((k) => this.onlineUsers[k][user.id])
        .map((room) => {
          console.log('leave', room);
          if (Number(room)) {
            console.log('left', room);
            delete this.onlineUsers[room][user.id];
          }
        });
    }
  }

  async joinRoom(socket: Socket, newRoom: number, action: string, user: any) {
    //create new Room
    if (!this.onlineUsers[newRoom]) {
      this.onlineUsers[newRoom] = new Avatar();
      this.lastSent[newRoom] = new Date();
      console.log(action);
    }

    //leave old roomS
    Object.keys(this.onlineUsers)
      .filter((k) => this.onlineUsers[k][user.id])
      .map((room) => {
        console.log('leave', room);
        if (Number(room)) {
          console.log('left', room);
          socket.leave(String(room));
          delete this.onlineUsers[room][user.id];
        }
      });

    //leave old roomS
    if (Number(newRoom)) {
      socket.join(String(newRoom));
      this.onlineUsers[newRoom][user.id] = {
        userId: user.id,
        username: user.username,
        profile_image: user.profile_image,
        position: { x: 0, y: 0, z: 0, dir: { x: 0, y: 0, z: 0 } },
      };
    }
    this.emitUsers(newRoom);
  }

  async getUser(token: string) {
    const { id, username, profile_image, roles, projects, chatrooms } =
      await this.authService.getUserDatafromJWT(token);
    return {
      id,
      username,
      profile_image,
      roles: _.map(roles, 'id'),
      projects: _.map(projects, 'id'),
      chatrooms: _.map(chatrooms, 'id'),
    };
  }

  emitUsers(roomId: number) {
    return this.server.in(String(roomId)).emit('getplayers', {
      projectId: roomId,
      pos: this.onlineUsers[roomId],
    });
  }

  @SubscribeMessage('join_viewport')
  async switchRoom(
    @MessageBody() req: SwitchRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    await this.joinRoom(socket, req.newRoom, 'join_viewport', req.user);
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
  }

  async sendInViewport(msg: string, action: string, projectId: number) {
    this.logger.log('sendUpdateSelectedProjects');
    this.server.in(String(projectId)).emit('update', {
      message: msg,
      action: action,
    });
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
        this.emitUsers(req.chatroomId);
      }
    }
  }
}
