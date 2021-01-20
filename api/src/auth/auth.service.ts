import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../api/user/user.service';
import { UtilsService } from '../utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entities/models';
import { signupwithInvite } from '../api/user/dto/user.dto';
import * as bcrypt from 'bcrypt';
import _ = require('lodash');

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly utils: UtilsService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneAuthUser(username);
    this.logger.debug(user);
    if (!user) {
      throw new HttpException('Authentication failed!', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(
    signupwithInvite: signupwithInvite,
  ): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      const res = await this.userService.signup(signupwithInvite, false, false);
      this.logger.log(JSON.stringify(res) + 'New User registred');
      this.utils.signup(res.email, res.username, res.password);
    } catch (err) {
      this.logger.error('Registrations fails');
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }
  async getUserDatafromJWT(token: string) {
    const payload = this.jwtService.decode(token);
    return this.userService.findByUserId(payload.sub);
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profile_image: user.profile_image,
      roles: _.map(user.roles, 'name'),
      accessToken: this.jwtService.sign(payload),
    };
  }
}
