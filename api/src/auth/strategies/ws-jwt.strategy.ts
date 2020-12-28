import { Injectable, ExecutionContext } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { UserService } from '../../api/user/user.service';
import { ConnectedSocket } from '../guards/connected-socket';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  async validate(payload: any, socket: ConnectedSocket) {
    console.log('tadda', payload);
    const getUser = await this.userService.findByUserId(payload.sub);
    socket.conn.userid = getUser.id;
    socket.conn.username = getUser.username;
    socket.conn.profile_image = getUser.profile_image;
    return true;
  }
}
