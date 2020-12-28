import * as SocketIO from 'socket.io';

export interface ConnectedSocket extends SocketIO.Socket {
  conn: SocketIO.EngineSocket & {
    token: string;
    userid: number;
    username?: string;
    profile_image?: string;
  };
}
