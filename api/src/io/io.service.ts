import { WsException } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../auth/constants';
import { UserService } from '../api/user/user.service';

@Injectable()
export class IoService {
  constructor(private readonly userService: UserService) {}

  // in jwtService
  async verify(token: string): Promise<Object | null> {
    try {
      const payload = <any>jwt.verify(
        token,
        jwtConstants.secret,
        function (err) {
          if (err) {
            throw new WsException(err.message);
          }
        },
      );
      const user = await this.userService.findByUserId(payload.sub);

      if (!user) {
        throw new WsException('Unauthorized access');
      }

      return user;
    } catch (err) {
      throw new WsException(err.message);
    }
  }
}
