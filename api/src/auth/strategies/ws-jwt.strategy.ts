import { Injectable, ExecutionContext } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { UserService } from '../../api/user/user.service';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  async validate(payload: any) {
    const user = await this.userService.findByUserId(payload.sub);
    return user;
  }
}
