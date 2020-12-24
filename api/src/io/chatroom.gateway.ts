import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { IoService } from './io.service';

@WebSocketGateway({ namespace: 'chatroom' })
export class ChatroomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly ioservice: IoService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatroomGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.ioservice.verify(client.handshake.query.token);

    //    this.connectedUsers = [...this.connectedUsers, String(user._id)];
    //
    //    // Send list of connected users
    //    this.server.emit('users', this.connectedUsers);
    //    this.logger.log(`Client connected: ${client.handshake.headers}`);
    this.logger.debug(`Connected ${JSON.stringify(user)}`);
  }
}
