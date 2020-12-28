import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { WsException } from '@nestjs/websockets';
import { ConnectedSocket } from './connected-socket';

@Injectable()
export class WsJwtGuard extends AuthGuard('wsjwt') {
  canActivate(context: ExecutionContext) {
    const client = context?.switchToWs()?.getClient<ConnectedSocket>();
    const token = client.handshake.query.token;

    if (!token) {
      throw new WsException('Authentication token not found.');
    }

    const authHeader = {
      authorization: token,
    };
    const req = { headers: authHeader };

    return super.canActivate(new ExecutionContextHost([req]));
  }
}
//import { AuthGuard } from '@nestjs/passport';
//import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
//import { WsException } from '@nestjs/websockets';
//import { ConnectedSocket } from './connected-socket';
//@Injectable()
//export class WsJwtGuard extends AuthGuard('wsjwt') {
//  async canActivate(context: ExecutionContext): Promise<boolean> {
//    console.log('SocketSession activated');
//    const client = context?.switchToWs()?.getClient<ConnectedSocket>();
//    const token = client.handshake.query.token;
//    console.log(context);
//    const user = await super.canActivate(context);
//    console.log(user);
//    return true;
//  }
//
//  //  static async verifyToken(
//  //    jwtService: JwtService,
//  //    socket: ConnectedSocket,
//  //    token?: string,
//  //  ) {
//  //    if (
//  //      socket.conn.userid &&
//  //      (await jwtService.verifyAsync(socket.conn.token))
//  //    ) {
//  //      return true;
//  //    }
//  //
//  //    if (!token) return false;
//  //
//  //    socket.conn.token = token;
//  //    const { sub } = await jwtService.decode(token);
//  //    socket.conn.userId = sub;
//  //    console.log(`Setting connection userId to "${sub}"`);
//  //    return true;
//  //  }
//}
