import {
  Injectable,
  ExecutionContext,
  Logger,
  CanActivate,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthService.name);
  async canActivate(context: ExecutionContext) {
    const { token } = context.switchToWs().getClient().handshake.query;

    if (!token) {
      this.logger.error('no token');
      throw new WsException('Auth Error!');
    }

    const {
      id,
      username,
      profile_image,
    } = await this.authService.getUserDatafromJWT(token);

    if (!id) {
      this.logger.error('no user');
      throw new WsException('Auth Error!');
    }

    context.switchToWs().getData().user = { id, username, profile_image };

    return Boolean(id);
  }
}
