import { Injectable,Logger } from '@nestjs/common';
import { UserService } from '../api/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entities/user.entity'
import { signupwithInvite } from '../api/user/dto/user.dto';
import * as bcrypt from 'bcrypt';

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

    private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(signupwithInvite: signupwithInvite): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      let res = await this.userService.signup(signupwithInvite, false, false);
      this.logger.log('New User registred');
    } catch (err) {
      this.logger.error('Registrations fails');
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
		//TODO return payload
		//
		//{"id":1,"username":"admin","email":"admin@bim-cloud.org","profile_image":"https://icapi.bim-cloud.org/static/profile_image/admin.jpg","roles":["ROLE_USER","ROLE_ADMIN"],"projects":["Assigned_Project:_InterACT","Assigned_Project:_Haus","Assigned_Project:_New
		//Project","Assigned_Project:_New Project","Assigned_Project:_New
		//Project"],"accessToken":""}
    return {
      user: user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
